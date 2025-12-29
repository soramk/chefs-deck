// --- Mock Data Generator (Updated Structure) ---
const simulateScraping = (url) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let title = "Webから収集した美味しいレシピ";
            let ingredients = [
                { name: "玉ねぎ", amount: 1, unit: "個" },
                { name: "人参", amount: 1, unit: "本" },
                { name: "オリーブオイル", amount: "", unit: "適量" },
                { name: "塩コショウ", amount: "", unit: "少々" }
            ];
            let steps = ["野菜を切ります。", "フライパンで炒めます。", "火が通ったら完成です。"];
            let image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60";
            let baseServings = 2;

            if (url.includes("curry") || url.includes("カレー")) {
                title = "隠し味が決め手の特製カレー";
                ingredients = [
                    { name: "豚肉", amount: 200, unit: "g" },
                    { name: "玉ねぎ", amount: 2, unit: "個" },
                    { name: "人参", amount: 1, unit: "本" },
                    { name: "じゃがいも", amount: 2, unit: "個" },
                    { name: "カレールー", amount: 0.5, unit: "箱" },
                    { name: "チョコレート", amount: 1, unit: "カケ" }
                ];
                steps = ["野菜を一口大に切る。", "鍋で肉と野菜をよく炒める。", "水を加えて20分煮込む。", "火を止めてルーとチョコを溶かす。", "弱火で10分煮込んで完成。"];
                image = "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=500&auto=format&fit=crop&q=60";
                baseServings = 4;
            } else if (url.includes("pasta") || url.includes("パスタ")) {
                title = "基本のトマトバジルパスタ";
                ingredients = [
                    { name: "パスタ", amount: 200, unit: "g" },
                    { name: "トマト缶", amount: 1, unit: "缶" },
                    { name: "ニンニク", amount: 1, unit: "片" },
                    { name: "オリーブオイル", amount: 2, unit: "大さじ" },
                    { name: "バジル", amount: "", unit: "適量" }
                ];
                steps = ["お湯を沸かしてパスタを茹でる。", "フライパンでニンニクを炒める。", "トマト缶を入れて煮詰める。", "茹で上がったパスタを和える。", "バジルを散らす。"];
                image = "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&auto=format&fit=crop&q=60";
                baseServings = 2;
            }

            resolve({
                id: Date.now(),
                title,
                url,
                image,
                ingredients, // New structure: [{name, amount, unit}, ...]
                steps,
                baseServings,
                notes: "Webサイトからの収集（シミュレーション）",
                createdAt: new Date().toISOString()
            });
        }, 1500);
    });
};

// --- Helper: Data Migration ---
const migrateRecipe = (recipe) => {
    // Check if ingredients are strings (Old format)
    if (recipe.ingredients && recipe.ingredients.length > 0 && typeof recipe.ingredients[0] === 'string') {
        const newIngredients = recipe.ingredients.map(str => {
            // Try to parse "Name Amount Unit" or "Name Amount"
            // Simple Regex: Looks for numbers in the string
            const match = str.match(/^(.+?)\s*([0-9.]+|½|¼|¾)\s*(.+)?$/);
            if (match) {
                return { 
                    name: match[1].trim(), 
                    amount: isNaN(parseFloat(match[2])) ? match[2] : parseFloat(match[2]), 
                    unit: match[3] ? match[3].trim() : "" 
                };
            }
            return { name: str, amount: "", unit: "" };
        });
        return { ...recipe, ingredients: newIngredients, baseServings: 2 }; // Default to 2 servings
    }
    // Ensure baseServings exists
    if (!recipe.baseServings) {
        return { ...recipe, baseServings: 2 };
    }
    return recipe;
};

