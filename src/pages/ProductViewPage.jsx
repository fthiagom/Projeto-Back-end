import Layout from '../components/Layout';
import Gallery from '../components/Gallery';
import BuyBox from '../components/BuyBox';
import ProductOptions from '../components/ProductOptions';
import Section from '../components/Section';
import ProductListing from '../components/ProductListing';

const ProductViewPage = () => {
  const productImages = [
    { src: '/produc-image-1.jpeg' },
    { src: '/produc-image-2.jpeg' },
    { src: '/produc-image-3.jpeg' },
    { src: '/produc-image-4.jpeg' },
    { src: '/produc-image-5.jpeg' },
  ];

  const recommendedProducts = [
    {
      name: 'K-Swiss V8 - Masculino',
      image: '/product-thumb-1.jpeg',
      price: 200,
      priceDiscount: 149.9
    },
    {
      name: 'K-Swiss V8 - Masculino',
      image: '/product-thumb-2.jpeg',
      price: 200,
      priceDiscount: 149.9
    },
    {
      name: 'K-Swiss V8 - Masculino',
      image: '/product-thumb-3.jpeg',
      price: 200,
      priceDiscount: 149.9
    },
    {
      name: 'K-Swiss V8 - Masculino',
      image: '/product-thumb-4.jpeg',
      price: 200,
      priceDiscount: 149.9
    }
  ];

  return (
    <Layout>
      <div style={{ backgroundColor: '#F9F8FE', padding: '40px 100px' }}>
    
        <div
          style={{
            fontSize: '14px',
            color: 'var(--dark-gray-2, #474747)',
            marginBottom: '30px'
          }}
        >
          <strong>Home</strong> / Produtos / Tênis / Nike / Tênis Nike Revolution 6 Next Nature Masculino
        </div>

        
        <div
          style={{
            display: 'flex',
            gap: '40px',
            marginBottom: '80px',
            flexWrap: 'wrap'
          }}
        >
          <Gallery
            images={productImages}
            showThumbs
            width="700px"
            height="570px"
            radius="4px"
          />

          <BuyBox
            name="Tênis Nike Revolution 6 Next Nature Masculino"
            reference="Casual | Nike | REF:38416711"
            stars="4.7"
            rating={90}
            price={219.0}
            priceDiscount={149.9}
            description="Tênis leve e confortável para corridas diárias e caminhadas, com amortecimento macio, entressola em espuma responsiva e cabedal respirável."
          >
           
            <div style={{ marginBottom: '20px' }}>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: 'var(--light-gray, #8F8F8F)',
                  display: 'block'
                }}
              >
                Tamanho
              </span>
              <ProductOptions
                options={['39', '40', '41', '42', '43']}
                radius="4px"
                shape="square"
                type="text"
              />
            </div>

           
            <div>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: 'var(--light-gray, #8F8F8F)',
                  display: 'block'
                }}
              >
                Cor
              </span>
              <ProductOptions
                options={['#6FEEFF', '#FF6969', '#5E5E5E', '#6D70B7']}
                shape="circle"
                type="color"
              />
            </div>
          </BuyBox>
        </div>

       
        <Section
          title="Produtos recomendados"
          titleAlign="left"
          link={{
            text: 'Ver todos',
            href: '/products'
          }}
        >
          <ProductListing products={recommendedProducts} />
        </Section>
      </div>
    </Layout>
  );
};

export default ProductViewPage;