// --- Components ---

const RecipeCard = ({ recipe, onDelete, onEdit }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [scaleFactor, setScaleFactor] = useState(1);
    
    // Current servings calculated from base
    const currentServings = Math.round((recipe.baseServings || 2) * scaleFactor * 10) / 10;

    const handleServingChange = (e) => {
        const val = parseFloat(e.target.value);
        if (val > 0) {
            const base = recipe.baseServings || 2;
            setScaleFactor(val / base);
        }
    };

    const handleIngredientAmountChange = (baseAmount, newVal) => {
        if (baseAmount && newVal > 0) {
            setScaleFactor(newVal / baseAmount);
        }
    };

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden card-hover transition-all duration-300 fade-in flex flex-col relative h-fit">
            {/* Card Top Decoration */}
            <div className="h-1 w-full bg-indigo-500"></div>
            
            <div className="h-48 overflow-hidden relative group cursor-pointer" onClick={toggleExpand}>
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">
                    #{recipe.id.toString().slice(-4)}
                </div>
                <div className="absolute bottom-2 right-2 bg-indigo-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                     <IconCalculator className="w-3 h-3" />
                     {isExpanded ? "計算中" : "分量計算"}
                </div>
            </div>

            <div className="p-5 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-2 font-brand cursor-pointer hover:text-indigo-600 transition-colors" onClick={toggleExpand}>
                        {recipe.title}
                    </h3>
                    <button onClick={toggleExpand} className="text-slate-400 hover:text-indigo-500 p-1">
                        {isExpanded ? <IconChevronUp className="w-5 h-5"/> : <IconChevronDown className="w-5 h-5"/>}
                    </button>
                </div>
                
                {!isExpanded ? (
                    // Simple View
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <IconUsers className="w-3 h-3" /> {recipe.baseServings}人分
                        </span>
                        <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-xs font-medium">
                            {recipe.ingredients.length} 材料
                        </span>
                    </div>
                ) : (
                    // Expanded / Calculator View
                    <div className="mb-4 fade-in">
                        <div className="bg-indigo-50 rounded-lg p-3 mb-4 border border-indigo-100">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-indigo-800 uppercase tracking-wide flex items-center gap-1">
                                    <IconCalculator className="w-3 h-3" /> Smart Scaling
                                </label>
                                <button 
                                    onClick={() => setScaleFactor(1)}
                                    className="text-[10px] bg-white border border-indigo-200 text-indigo-600 px-2 py-0.5 rounded hover:bg-indigo-50 transition-colors"
                                >
                                    リセット
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={currentServings}
                                            onChange={handleServingChange}
                                            step="0.5"
                                            min="0.5"
                                            className="w-full pl-8 pr-2 py-1.5 rounded bg-white border border-indigo-200 text-indigo-900 font-bold focus:ring-2 focus:ring-indigo-300 outline-none text-center"
                                        />
                                        <IconUsers className="w-4 h-4 text-indigo-400 absolute left-2 top-1/2 -translate-y-1/2" />
                                    </div>
                                    <div className="text-[10px] text-center text-indigo-500 mt-1 font-bold">人分を作る</div>
                                </div>
                            </div>
                            <p className="text-[10px] text-indigo-400 mt-2 text-center leading-tight">
                                下の材料の数値を変更しても<br/>全体が自動計算されます
                            </p>
                        </div>

                        <div className="space-y-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                            {recipe.ingredients.map((ing, idx) => {
                                const isNumber = ing.amount && !isNaN(parseFloat(ing.amount));
                                const calculatedAmount = isNumber 
                                    ? Math.round(parseFloat(ing.amount) * scaleFactor * 100) / 100 
                                    : ing.amount;

                                return (
                                    <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded px-1 transition-colors group/row">
                                        <span className="text-slate-700 font-medium truncate flex-1">{ing.name}</span>
                                        <div className="flex items-center gap-1">
                                            {isNumber ? (
                                                <input 
                                                    type="number"
                                                    value={calculatedAmount}
                                                    onChange={(e) => handleIngredientAmountChange(ing.amount, e.target.value)}
                                                    className="w-16 text-right font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white outline-none transition-all py-0.5 px-1 rounded text-sm"
                                                />
                                            ) : (
                                                <span className="text-slate-500 text-xs">{ing.amount}</span>
                                            )}
                                            <span className="text-slate-400 text-xs w-8 text-left">{ing.unit}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                     <a 
                        href={recipe.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-indigo-500 transition-colors flex items-center gap-1 text-xs"
                        title="元のサイトを開く"
                    >
                        <IconExternalLink className="w-4 h-4" /> Source
                    </a>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => onEdit(recipe)}
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        >
                            <IconEdit className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => onDelete(recipe.id)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <IconTrash className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RecipeEditor = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {
        title: "",
        url: "",
        image: "https://images.unsplash.com/photo-1495521841625-f462cd2f24d5?w=500&auto=format&fit=crop&q=60",
        ingredients: [{ name: "", amount: "", unit: "" }],
        steps: [""],
        baseServings: 2,
        notes: ""
    });

    // Ensure ingredients structure is correct (for newly created recipes)
    useEffect(() => {
        if (initialData && initialData.ingredients && typeof initialData.ingredients[0] === 'string') {
            // Quick migration for edit view if somehow raw string data gets in
            setFormData(migrateRecipe(initialData));
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setFormData({ ...formData, ingredients: newIngredients });
    };

    const handleStepChange = (index, value) => {
        const newSteps = [...formData.steps];
        newSteps[index] = value;
        setFormData({ ...formData, steps: newSteps });
    };

    const addIngredient = () => {
        setFormData({ ...formData, ingredients: [...formData.ingredients, { name: "", amount: "", unit: "" }] });
    };

    const removeIngredient = (index) => {
        setFormData({ ...formData, ingredients: formData.ingredients.filter((_, i) => i !== index) });
    };

    const addStep = () => {
        setFormData({ ...formData, steps: [...formData.steps, ""] });
    };

    const removeStep = (index) => {
        setFormData({ ...formData, steps: formData.steps.filter((_, i) => i !== index) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: formData.id || Date.now(),
            ingredients: formData.ingredients.filter(i => i.name.trim() !== ""),
            steps: formData.steps.filter(s => s.trim() !== "")
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 fade-in max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 font-brand">
                <IconEdit className="text-indigo-500" />
                Edit Card
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">料理名</label>
                            <input 
                                type="text" 
                                required
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                placeholder="例：絶品ハンバーグ"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">基準の人数</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    min="1"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all pl-10"
                                    value={formData.baseServings}
                                    onChange={(e) => handleChange("baseServings", e.target.value === "" ? "" : parseFloat(e.target.value))}
                                />
                                <IconUsers className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">人分</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">参考URL</label>
                            <input 
                                type="url" 
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all text-sm text-slate-600"
                                value={formData.url}
                                onChange={(e) => handleChange("url", e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">画像URL</label>
                        <div className="relative mb-2">
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all text-sm"
                                value={formData.image}
                                onChange={(e) => handleChange("image", e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="h-32 w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                            <img 
                                src={formData.image || "https://placehold.co/600x400?text=No+Image"} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = "https://placehold.co/600x400?text=No+Image"}
                            />
                        </div>
                    </div>
                </div>

                {/* Ingredients */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-lg font-bold text-slate-700 font-brand">Ingredients</label>
                        <button type="button" onClick={addIngredient} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                            <IconPlus className="w-4 h-4" /> 追加
                        </button>
                    </div>
                    <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-400 mb-1 px-1">
                            <div className="col-span-6">材料名</div>
                            <div className="col-span-3">分量 (数値)</div>
                            <div className="col-span-2">単位</div>
                        </div>
                        {formData.ingredients.map((ing, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-6">
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 outline-none text-sm"
                                        value={ing.name}
                                        onChange={(e) => handleIngredientChange(idx, "name", e.target.value)}
                                        placeholder="材料名"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <input 
                                        type="number"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 outline-none text-sm"
                                        value={ing.amount}
                                        onChange={(e) => handleIngredientChange(idx, "amount", e.target.value)}
                                        placeholder="例: 200"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 outline-none text-sm"
                                        value={ing.unit}
                                        onChange={(e) => handleIngredientChange(idx, "unit", e.target.value)}
                                        placeholder="g/個"
                                    />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <button type="button" onClick={() => removeIngredient(idx)} className="text-slate-400 hover:text-red-500 p-1">
                                        <IconTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Steps */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-lg font-bold text-slate-700 font-brand">Directions</label>
                        <button type="button" onClick={addStep} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                            <IconPlus className="w-4 h-4" /> 追加
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.steps.map((step, idx) => (
                            <div key={idx} className="flex gap-2 items-start">
                                <span className="mt-2 text-xs font-bold text-slate-400 w-6 text-center">{idx + 1}</span>
                                <textarea 
                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 outline-none text-sm min-h-[60px]"
                                    value={step}
                                    onChange={(e) => handleStepChange(idx, e.target.value)}
                                    placeholder="工程を入力..."
                                />
                                <button type="button" onClick={() => removeStep(idx)} className="text-slate-400 hover:text-red-500 mt-2">
                                    <IconTrash className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t border-slate-100">
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className="flex-1 py-3 px-4 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold transition-colors"
                    >
                        キャンセル
                    </button>
                    <button 
                        type="submit" 
                        className="flex-1 py-3 px-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg font-bold transition-all flex justify-center items-center gap-2"
                    >
                        <IconSave className="w-5 h-5" />
                        デッキに保存
                    </button>
                </div>
            </form>
        </div>
    );
};

