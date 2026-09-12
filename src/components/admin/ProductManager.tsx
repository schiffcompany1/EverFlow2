import React, { useState } from 'react';
import { Plus, Search, Filter, Edit3, Trash2, Zap, Shield, RotateCcw, Check, Sparkles, ExternalLink } from 'lucide-react';
import { ProductModel } from '../../types';
import { formatNaira } from '../../utils/formatters';
import { AddEditProductModal } from './AddEditProductModal';
import { useStore } from '../../context/StoreContext';

export const ProductManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts, setView } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'residential' | 'commercial' | 'industrial'>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductModel | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kva.toString().includes(searchQuery);
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: ProductModel) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (productData: Omit<ProductModel, 'id'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      showNotification(`Updated ${productData.name} successfully.`);
    } else {
      const created = addProduct(productData);
      showNotification(`Posted new model "${created.name}" for sale! It is now live on the storefront.`);
    }
  };

  const handleDelete = (id: string, name: string) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
    showNotification(`Removed "${name}" from the store catalog.`);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Toast notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-500/40 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search generator models or kVA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['all', 'residential', 'commercial', 'industrial'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetProducts}
            title="Reset to initial factory models"
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Product</span>
          </button>
        </div>
      </div>

      {/* Stats micro-summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing <strong className="text-slate-900 font-mono">{filteredProducts.length}</strong> generator model{filteredProducts.length === 1 ? '' : 's'} available in catalog
        </div>
        <button
          onClick={() => setView('store')}
          className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>View Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Top Media & Badges */}
            <div className="relative h-44 bg-slate-100 overflow-hidden group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-white font-mono font-bold text-[11px] shadow-sm">
                  {product.kva} kVA
                </span>
                {product.badge && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-md bg-white/90 text-slate-800 font-semibold text-[10px] capitalize shadow-xs">
                  {product.category}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h4 className="font-bold text-base font-heading leading-tight drop-shadow-sm">
                  {product.name}
                </h4>
                <p className="text-[11px] text-slate-200 truncate drop-shadow-sm">
                  {product.tagline}
                </p>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              {/* Pricing breakdown */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Outright Price:</span>
                  <span className="text-slate-900 font-bold font-mono text-sm">
                    {formatNaira(product.outrightPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-medium">Pay-Small-Small:</span>
                  <span className="text-emerald-800 font-bold font-mono text-xs">
                    From {formatNaira(product.monthlyFrom)} / mo
                  </span>
                </div>
              </div>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-lg">
                  <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{product.continuousWatts}W Cont.</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-lg">
                  <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{product.warrantyYears}-Yr Warranty</span>
                </div>
              </div>

              {/* Recommended Loads preview */}
              <div className="text-[11px] text-slate-500 line-clamp-2">
                <span className="font-semibold text-slate-700">Runs: </span>
                {product.recommendedFor.join(', ')}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {deleteConfirmId === product.id ? (
                  <div className="w-full flex items-center justify-between gap-2 bg-rose-50 p-1.5 rounded-xl border border-rose-200">
                    <span className="text-[11px] text-rose-800 font-bold">Confirm delete?</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-700 cursor-pointer"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 bg-white text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold hover:bg-slate-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setDeleteConfirmId(product.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete model from store"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Specs & Price</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <AddEditProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />
    </div>
  );
};
