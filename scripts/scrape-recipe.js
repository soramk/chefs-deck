#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const RECIPE_URL = process.env.RECIPE_URL || process.argv[2];
const USE_GEMINI = process.env.USE_GEMINI === 'true' || process.argv[3] === 'true';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!RECIPE_URL) {
    console.error('Error: Recipe URL is required');
    process.exit(1);
}

// レシピデータの保存先
const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// レシピデータのスキーマ
const RECIPE_SCHEMA = {
    id: null,
    title: '',
    url: '',
    image: '',
    ingredients: [], // [{name, amount, unit}]
    steps: [],
    baseServings: 2,
    notes: '',
    scrapedAt: new Date().toISOString(),
    scrapingProtocol: null, // 使用したスクレイピングプロトコル
    source: '' // サイト名
};

// スクレイピングプロトコル定義
const SCRAPING_PROTOCOLS = {
    // 汎用JSON-LD構造化データ
    jsonLd: {
        name: 'JSON-LD',
        selector: 'script[type="application/ld+json"]',
        extract: ($, protocol) => {
            const scripts = $('script[type="application/ld+json"]');
            for (let i = 0; i < scripts.length; i++) {
                try {
                    const data = JSON.parse($(scripts[i]).html());
                    if (data['@type'] === 'Recipe' || (Array.isArray(data) && data.find(item => item['@type'] === 'Recipe'))) {
                        const recipe = Array.isArray(data) ? data.find(item => item['@type'] === 'Recipe') : data;
                        return {
                            title: recipe.name || recipe.headline || '',
                            image: recipe.image?.url || recipe.image || '',
                            ingredients: recipe.recipeIngredient?.map(ing => {
                                if (typeof ing === 'string') {
                                    // "材料名 分量 単位" 形式をパース
                                    const match = ing.match(/^(.+?)\s*([0-9.]+|½|¼|¾)?\s*(.+)?$/);
                                    return {
                                        name: match ? match[1].trim() : ing,
                                        amount: match && match[2] ? match[2] : '',
                                        unit: match && match[3] ? match[3].trim() : ''
                                    };
                                }
                                return ing;
                            }) || [],
                            steps: recipe.recipeInstructions?.map(step => 
                                typeof step === 'string' ? step : step.text || step.name || ''
                            ) || [],
                            baseServings: recipe.recipeYield || 2
                        };
                    }
                } catch (e) {
                    continue;
                }
            }
            return null;
        }
    },
    
    // Cookpad形式
    cookpad: {
        name: 'Cookpad',
        selector: '.recipe',
        extract: ($, protocol) => {
            const title = $('.recipe-title').text().trim();
            const image = $('.recipe-image img').attr('src') || '';
            const ingredients = [];
            $('.ingredient').each((i, el) => {
                const name = $(el).find('.ingredient-name').text().trim();
                const amount = $(el).find('.ingredient-amount').text().trim();
                const unit = $(el).find('.ingredient-unit').text().trim();
                ingredients.push({ name, amount, unit });
            });
            const steps = [];
            $('.step').each((i, el) => {
                steps.push($(el).find('.step-text').text().trim());
            });
            const baseServings = parseInt($('.servings').text().match(/\d+/)?.[0] || '2');
            
            if (title) {
                return { title, image, ingredients, steps, baseServings };
            }
            return null;
        }
    },
    
    // レシピブログ形式（汎用）
    recipeBlog: {
        name: 'Recipe Blog',
        selector: 'article, .recipe, .recipe-content',
        extract: ($, protocol) => {
            const title = $('h1, .recipe-title, .entry-title').first().text().trim();
            const image = $('.recipe-image img, .entry-content img').first().attr('src') || '';
            
            // 材料セクションを探す
            const ingredients = [];
            $('h2, h3').each((i, el) => {
                const heading = $(el).text().toLowerCase();
                if (heading.includes('材料') || heading.includes('ingredient')) {
                    $(el).nextUntil('h2, h3').find('li, p, tr').each((j, item) => {
                        const text = $(item).text().trim();
                        if (text) {
                            const match = text.match(/^(.+?)\s*([0-9.]+|½|¼|¾)?\s*(.+)?$/);
                            ingredients.push({
                                name: match ? match[1].trim() : text,
                                amount: match && match[2] ? match[2] : '',
                                unit: match && match[3] ? match[3].trim() : ''
                            });
                        }
                    });
                }
            });
            
            // 手順セクションを探す
            const steps = [];
            $('h2, h3').each((i, el) => {
                const heading = $(el).text().toLowerCase();
                if (heading.includes('作り方') || heading.includes('手順') || heading.includes('step') || heading.includes('direction')) {
                    $(el).nextUntil('h2, h3').find('li, p').each((j, item) => {
                        const text = $(item).text().trim();
                        if (text && text.length > 10) {
                            steps.push(text);
                        }
                    });
                }
            });
            
            if (title && (ingredients.length > 0 || steps.length > 0)) {
                return { title, image, ingredients, steps, baseServings: 2 };
            }
            return null;
        }
    }
};

// Gemini APIを使用してレシピを抽出
async function extractWithGemini(html, url) {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set');
    }
    
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // HTMLからテキストを抽出（簡易版）
    const $ = cheerio.load(html);
    $('script, style, nav, footer, header').remove();
    const text = $('body').text().replace(/\s+/g, ' ').substring(0, 50000); // 制限内に収める
    
    const prompt = `以下のWebページのテキストからレシピ情報を抽出してください。
URL: ${url}

テキスト:
${text}

以下のJSON形式で返してください：
{
  "title": "レシピ名",
  "image": "画像URL（見つからない場合は空文字）",
  "ingredients": [
    {"name": "材料名", "amount": "分量（数値または空文字）", "unit": "単位"}
  ],
  "steps": ["手順1", "手順2", ...],
  "baseServings": 2
}`;

    // gemini-3-flash-previewモデルを使用
    const modelName = 'gemini-3-flash-preview';
    const model = genAI.getGenerativeModel({ model: modelName });
    
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        
        // JSONを抽出
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Failed to extract JSON from Gemini response');
    } catch (error) {
        console.error('Gemini API error:', error);
        throw error;
    }
}

// メインスクレイピング関数
async function scrapeRecipe(url) {
    console.log(`Scraping recipe from: ${url}`);
    
    try {
        // HTMLを取得
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);
        
        let recipeData = null;
        let protocolUsed = null;
        
        if (USE_GEMINI) {
            // Gemini APIを使用
            console.log('Using Gemini API for extraction...');
            recipeData = await extractWithGemini(html, url);
            protocolUsed = 'gemini-api';
        } else {
            // プロトコルを順番に試す
            for (const [key, protocol] of Object.entries(SCRAPING_PROTOCOLS)) {
                try {
                    const result = protocol.extract($, protocol);
                    if (result && result.title) {
                        recipeData = result;
                        protocolUsed = key;
                        console.log(`Successfully extracted using protocol: ${protocol.name}`);
                        break;
                    }
                } catch (error) {
                    console.warn(`Protocol ${key} failed:`, error.message);
                    continue;
                }
            }
        }
        
        if (!recipeData || !recipeData.title) {
            throw new Error('Failed to extract recipe data');
        }
        
        // レシピデータを完成させる
        const recipe = {
            ...RECIPE_SCHEMA,
            id: Date.now(),
            title: recipeData.title,
            url: url,
            image: recipeData.image || '',
            ingredients: recipeData.ingredients || [],
            steps: recipeData.steps || [],
            baseServings: recipeData.baseServings || 2,
            scrapingProtocol: protocolUsed,
            source: new URL(url).hostname
        };
        
        // JSONファイルとして保存
        const filename = `recipe-${recipe.id}.json`;
        const filepath = path.join(DATA_DIR, filename);
        fs.writeFileSync(filepath, JSON.stringify(recipe, null, 2), 'utf-8');
        
        console.log(`Recipe saved to: ${filepath}`);
        return recipe;
        
    } catch (error) {
        console.error('Scraping error:', error);
        throw error;
    }
}

// 実行
scrapeRecipe(RECIPE_URL)
    .then(recipe => {
        console.log('Success! Recipe extracted:', recipe.title);
        process.exit(0);
    })
    .catch(error => {
        console.error('Failed to scrape recipe:', error);
        process.exit(1);
    });

