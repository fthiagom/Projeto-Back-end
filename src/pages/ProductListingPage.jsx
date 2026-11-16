import React, { useState } from 'react';
import Layout from '../components/Layout';
import Section from '../components/Section';
import ProductListing from '../components/ProductListing';
import FilterGroup from '../components/FilterGroup';

export function ProductListingPage() {
  const [produtos] = useState([
    { id: 1, name: 'Tênis Nike', image: '/product-thumb-1.jpeg', price: 200, priceDiscount: 149.9 },
    { id: 2, name: 'Tênis Adidas', image: '/product-thumb-2.jpeg', price: 49.9 },
    { id: 3, name: 'Tênis Puma', image: '/product-thumb-3.jpeg', price: 300, priceDiscount: 250 },
  ]);

  const categorias = [
    { text: 'Esportivo' },
    { text: 'Casual' },
    { text: 'Utilitário' }
  ];

  return (
    <Layout>
      <div style={{ display: 'flex', gap: '30px', padding: '40px 100px' }}>
        <aside style={{ width: '308px' }}>
          <div style={{ backgroundColor: 'var(--white)', padding: '20px', borderRadius: '4px', marginBottom: '30px' }}>
            <label style={{ display: 'block', fontSize: '16px', color: 'var(--dark-gray-2)', marginBottom: '10px' }}>
              Ordenar por
            </label>
            <select style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '4px', border: '1px solid var(--light-gray-2)' }}>
              <option value="maior">Maior preço</option>
              <option value="menor">Menor preço</option>
            </select>
          </div>
          <FilterGroup title="Filtrar por" inputType="checkbox" options={categorias} />
        </aside>
        
        <main style={{ flex: 1 }}>
          <Section title={`Resultados (${produtos.length})`} titleAlign="left">
            <ProductListing products={produtos} />
          </Section>
        </main>
      </div>
    </Layout>
  );
}