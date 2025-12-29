// --- Main Application ---

const App = () => {
    const [recipes, setRecipes] = useState([]);
    const [view, setView] = useState("list"); // list, edit, import
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [importUrl, setImportUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    // Load from localStorage on mount with Migration Logic
    useEffect(() => {
        const newKey = "chefsDeckRecipes";
        const oldKey = "oreNoRecipes";
        
        const saved = localStorage.getItem(newKey);
        const oldSaved = localStorage.getItem(oldKey);

        let loadedData = [];

        if (saved) {
            try {
                loadedData = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to load recipes", e);
            }
        } else if (oldSaved) {
            try {
                loadedData = JSON.parse(oldSaved);
                showNotification("旧データを移行しました");
            } catch (e) {}
        } else {
            // Seed initial data
            loadedData = [{
                id: 1,
                title: "Chef's Special Curry",
                url: "https://example.com",
                image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=500&auto=format&fit=crop&q=60",
                ingredients: [
                    {name: "豚肉", amount: 200, unit: "g"}, 
                    {name: "玉ねぎ", amount: 2, unit: "個"},
                    {name: "人参", amount: 1, unit: "本"},
                    {name: "カレールー", amount: 0.5, unit: "箱"}
                ],
                steps: ["具材をすべてみじん切りにする。", "中華鍋を煙が出るまで熱し、油を馴染ませる。", "溶き卵を入れて半熟のうちにご飯を投入。", "切るように炒め、具材を投入。", "鍋肌から醤油を入れて香りを立たせたら完成。"],
                baseServings: 2,
                notes: "スターターデッキの1枚"
            }];
        }

        // Apply migration to ensure data structure is correct
        const migratedData = loadedData.map(migrateRecipe);
        setRecipes(migratedData);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (recipes.length > 0) {
            localStorage.setItem("chefsDeckRecipes", JSON.stringify(recipes));
        }
    }, [recipes]);

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleImport = async (e) => {
        e.preventDefault();
        if (!importUrl) return;

        setIsLoading(true);
        try {
            const mockData = await simulateScraping(importUrl);
            setEditingRecipe(mockData);
            setView("edit");
            setImportUrl("");
            showNotification("カードデータを生成中...");
        } catch (err) {
            showNotification("取り込みに失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = (recipe) => {
        if (recipes.some(r => r.id === recipe.id)) {
            setRecipes(recipes.map(r => r.id === recipe.id ? recipe : r));
            showNotification("カード情報を更新しました");
        } else {
            setRecipes([recipe, ...recipes]);
            showNotification("新しいカードをデッキに追加しました！");
        }
        setView("list");
        setEditingRecipe(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("このカードをデッキから破棄しますか？")) {
            setRecipes(recipes.filter(r => r.id !== id));
            showNotification("カードを破棄しました");
        }
    };

    const handleEdit = (recipe) => {
        setEditingRecipe(recipe);
        setView("edit");
    };

    const handleCreateNew = () => {
        setEditingRecipe(null);
        setView("edit");
    };

    return (
        <div className="min-h-screen pb-10 font-sans text-slate-600">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView("list")}>
                        <div className="bg-indigo-600 text-white p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
                            <IconLayers className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">Chef's Deck</h1>
                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest leading-none mt-1">Recipe Collection</span>
                        </div>
                    </div>
                    
                    {view === "list" && (
                        <button 
                            onClick={handleCreateNew}
                            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <IconPlus className="w-4 h-4" />
                            <span className="hidden sm:inline">Add Card</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-20 right-4 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl z-50 fade-in flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    {notification}
                </div>
            )}

            <main className="max-w-5xl mx-auto px-4 mt-8">
                
                {/* Import Section (Only on List View) */}
                {view === "list" && (
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 md:p-10 mb-10 shadow-lg text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
                            <IconLayers className="w-64 h-64" />
                        </div>
                        
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-2xl md:text-3xl font-bold mb-2 font-brand">Build Your Deck.</h2>
                            <p className="mb-6 text-indigo-100">
                                Web上のレシピをカード化して、あなただけの最強デッキ（レシピ集）を構築しよう。<br className="hidden md:inline"/>
                                人数や手持ちの材料に合わせて、分量を自動計算します。
                            </p>
                            
                            <form onSubmit={handleImport} className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 relative text-slate-800">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <IconSearch className="w-5 h-5" />
                                    </div>
                                    <input 
                                        type="url" 
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-4 focus:ring-indigo-300 outline-none shadow-sm font-medium"
                                        placeholder="Paste recipe URL here..."
                                        value={importUrl}
                                        onChange={(e) => setImportUrl(e.target.value)}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="bg-white text-indigo-600 font-bold py-3 px-6 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2 min-w-[140px]"
                                >
                                    {isLoading ? <IconLoader className="w-5 h-5 animate-spin" /> : "カード化"}
                                </button>
                            </form>
                            <p className="text-xs mt-3 text-indigo-200 opacity-70">
                                ※「curry」や「pasta」でサンプル生成。
                            </p>
                        </div>
                    </div>
                )}

                {/* Views Switcher */}
                {view === "list" ? (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                <IconLayers className="w-5 h-5 text-indigo-500" />
                                Your Deck
                                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{recipes.length}</span>
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recipes.length === 0 ? (
                                <div className="col-span-full text-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                                    <IconLayers className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>デッキが空です。<br/>URLを取り込んで最初のカードを追加しましょう。</p>
                                </div>
                            ) : (
                                recipes.map(recipe => (
                                    <RecipeCard 
                                        key={recipe.id} 
                                        recipe={recipe} 
                                        onDelete={handleDelete}
                                        onEdit={handleEdit}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <RecipeEditor 
                        initialData={editingRecipe} 
                        onSave={handleSave}
                        onCancel={() => setView("list")}
                    />
                )}

            </main>
        </div>
    );
};

// Initialize App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

