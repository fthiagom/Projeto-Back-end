import Layout from '../components/Layout';
import Gallery from '../components/Gallery';
import Section from '../components/Section';
import ProductListing from '../components/ProductListing';

export function HomePage() {
  const slideImages = [
    { src: '/home-slide-1.jpeg' },
    { src: '/home-slide-2.jpeg' },
    { src: '/home-slide-3.jpeg' },
    { src: '/home-slide-4.jpeg' },
    { src: '/home-slide-5.jpeg' },
    { src: '/home-slide-6.jpeg' },
    { src: '/home-slide-7.jpeg' },
    { src: '/home-slide-8.jpeg' }
  ];

  const featuredCollections = [
    { src: '/collection-1.png', alt: 'Coleção 1' },
    { src: '/collection-2.png', alt: 'Coleção 2' },
    { src: '/collection-3.png', alt: 'Coleção 3' }
  ];

  const products = [
    { id: 1, name: 'Tênis Nike', image: '/product-thumb-1.jpeg', price: 200, priceDiscount: 149.9 },
    { id: 2, name: 'Tênis Adidas', image: '/product-thumb-2.jpeg', price: 249.9 },
    { id: 3, name: "Levi's Ethan S WX", image: '/product-thumb-3.jpeg', price: 349.90 },
    { id: 4, name: 'Karhu Synchron Classic "Linnut Pack"', image: '/product-thumb-4.jpeg', price: 449.90 },
    { id: 5, name: 'Nike SuperRep Go', image: '/product-thumb-5.jpeg', price: 399.90 }
  ];

  return (
    <Layout>
      <Gallery
        images={slideImages}
        width="100%"
        height="681px"
        radius="0px"
      />

      <Section title="Coleções em destaque" titleAlign="center">
        <div
          style={{
            display: 'flex',
            gap: '60px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            padding: '20px 0'
          }}
        >
          {featuredCollections.map((col, index) => (
            <img
              key={index}
              src={col.src}
              alt={col.alt}
              style={{
                borderRadius: '4px',
                width: '100%',
                maxWidth: '360px',
                objectFit: 'cover'
              }}
            />
          ))}
        </div>
      </Section>

      <Section title="Produtos em alta" titleAlign="left">
        <ProductListing products={products} />
      </Section>
    </Layout>
  );
}