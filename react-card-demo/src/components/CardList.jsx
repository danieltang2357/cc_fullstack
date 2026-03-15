import Card from './Card';
import './CardList.css';

function CardList() {
  // 示例数据
  const cardsData = [
    {
      id: 1,
      title: 'React 入门',
      description: '学习 React 的基础知识，包括组件、props、state 等核心概念。',
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',
      tags: ['React', '前端', '教程']
    },
    {
      id: 2,
      title: 'JavaScript ES6+',
      description: '掌握现代 JavaScript 的新特性，让你的代码更简洁高效。',
      imageUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=200&fit=crop',
      tags: ['JavaScript', 'ES6', '开发']
    },
    {
      id: 3,
      title: 'CSS 动画技巧',
      description: '创建流畅的网页动画，提升用户体验和视觉效果。',
      imageUrl: 'https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=400&h=200&fit=crop',
      tags: ['CSS', '动画', '设计']
    },
    {
      id: 4,
      title: 'Node.js 后端开发',
      description: '使用 Node.js 构建高性能的服务器端应用程序。',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop',
      tags: ['Node.js', '后端', 'API']
    },
    {
      id: 5,
      title: 'Web 性能优化',
      description: '学习各种技术和策略来提升网站加载速度和运行效率。',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
      tags: ['性能', '优化', 'Web']
    },
    {
      id: 6,
      title: '响应式设计',
      description: '构建适配各种设备的网页，提供一致的用户体验。',
      imageUrl: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=400&h=200&fit=crop',
      tags: ['响应式', 'CSS', '移动端']
    }
  ];

  return (
    <div className="card-list-container">
      <h1 className="page-title">学习资源中心</h1>
      <p className="page-subtitle">探索精选的前端开发学习资源</p>
      <div className="card-list">
        {cardsData.map(card => (
          <Card
            key={card.id}
            title={card.title}
            description={card.description}
            imageUrl={card.imageUrl}
            tags={card.tags}
          />
        ))}
      </div>
    </div>
  );
}

export default CardList;
