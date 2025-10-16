import HeaderComponent from './HeaderComponent';
import FeatureCard from './FeatureCard';
import CTASection from './CTASection';
import Footer from './Footer';
import AnimatedSection from './AnimatedSection';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';

// 将 HeaderComponent 重命名为 Header 导出，保持 API 兼容性
export const Header = HeaderComponent;

export {
  FeatureCard,
  CTASection,
  Footer,
  AnimatedSection,
  ErrorBoundary,
  LoadingSpinner
};