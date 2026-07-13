import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import Masonry from '../../components/Masonry';
import LoadMoreButton from '../../components/LoadMoreButton';

const fallbackImages = [
  { id: '1', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=900&fit=crop', url: '', height: 800 },
  { id: '2', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=750&fit=crop', url: '', height: 650 },
  { id: '3', img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&h=800&fit=crop', url: '', height: 900 },
  { id: '4', img: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600&h=600&fit=crop', url: '', height: 500 },
  { id: '5', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=850&fit=crop', url: '', height: 750 },
  { id: '6', img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=700&fit=crop', url: '', height: 600 },
  { id: '7', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=950&fit=crop', url: '', height: 850 },
  { id: '8', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=650&fit=crop', url: '', height: 550 },
  { id: '9', img: 'https://images.unsplash.com/photo-1558618047-3c8c76fed4f1?w=600&h=800&fit=crop', url: '', height: 700 },
  { id: '10', img: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=700&fit=crop', url: '', height: 620 },
  { id: '11', img: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5b1c?w=600&h=800&fit=crop', url: '', height: 720 },
  { id: '12', img: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600&h=900&fit=crop', url: '', height: 810 },
  { id: '13', img: 'https://images.unsplash.com/photo-1550684847-9b5c2c4cfe22?w=600&h=750&fit=crop', url: '', height: 680 },
  { id: '14', img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=700&fit=crop', url: '', height: 630 },
  { id: '15', img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&h=800&fit=crop', url: '', height: 720 },
  { id: '16', img: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600&h=600&fit=crop', url: '', height: 540 },
  { id: '17', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=850&fit=crop', url: '', height: 760 },
  { id: '18', img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=700&fit=crop', url: '', height: 630 },
  { id: '19', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=950&fit=crop', url: '', height: 850 },
  { id: '20', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=650&fit=crop', url: '', height: 580 },
  { id: '21', img: 'https://images.unsplash.com/photo-1558618047-3c8c76fed4f1?w=600&h=800&fit=crop', url: '', height: 720 },
  { id: '22', img: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=700&fit=crop', url: '', height: 630 },
  { id: '23', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=900&fit=crop', url: '', height: 810 },
  { id: '24', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=750&fit=crop', url: '', height: 670 },
  { id: '25', img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&h=800&fit=crop', url: '', height: 720 },
  { id: '26', img: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600&h=600&fit=crop', url: '', height: 540 },
  { id: '27', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=850&fit=crop', url: '', height: 760 },
  { id: '28', img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=700&fit=crop', url: '', height: 630 },
  { id: '29', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=950&fit=crop', url: '', height: 850 },
  { id: '30', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=650&fit=crop', url: '', height: 580 },
  { id: '31', img: 'https://images.unsplash.com/photo-1558618047-3c8c76fed4f1?w=600&h=800&fit=crop', url: '', height: 720 },
  { id: '32', img: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=700&fit=crop', url: '', height: 630 },
  { id: '33', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=900&fit=crop', url: '', height: 810 },
  { id: '34', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=750&fit=crop', url: '', height: 670 },
  { id: '35', img: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5b1b?w=600&h=850&fit=crop', url: '', height: 760 },
];

const ITEMS_PER_PAGE = 15;

const Showcase = () => {
  const [allImages, setAllImages] = useState(fallbackImages);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/images')
      .then(res => res.json())
      .then(data => {
        if (data.images && data.images.length > 0) {
          const mapped = data.images.map((item: any) => ({
            id: item.id.toString(),
            img: item.url,
            url: '',
            height: 400 + Math.round(Math.random() * 200),
          }));
          setAllImages(mapped);
        }
      })
      .catch(() => { /* use fallback */ });
  }, []);

  const visibleItems = useMemo(() => allImages.slice(0, visibleCount), [allImages, visibleCount]);

  const hasMore = visibleCount < allImages.length;

  const handleLoadMore = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, allImages.length));
    setLoading(false);
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-background to-muted/50 pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <SEO title="Showcase" description="Explore AI-generated artistry in our gallery. Browse stunning visuals created with cutting-edge generative AI models." canonicalUrl="https://alpha.pro/" />

      <div className="max-w-7xl mx-auto px-4 py-12 mb-[100px]">
        <div className="relative">
          <Masonry
            items={visibleItems}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover
            hoverScale={0.95}
            blurToFocus
            colorShiftOnHover={false}
          />
        </div>

        {hasMore && (
          <div className="flex justify-center mt-12">
            <LoadMoreButton loading={loading} onClick={handleLoadMore} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Showcase;