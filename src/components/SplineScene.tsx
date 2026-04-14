import Spline from '@splinetool/react-spline';

interface SplineSceneProps {
  scene?: string;
  className?: string;
}

export const SplineScene = ({ 
  scene = "https://prod.spline.design/6Wq1Q7YGyH-4-m-Y/scene.splinecode",
  className = "" 
}: SplineSceneProps) => {
  return (
    <div className={`w-full h-full min-h-[400px] flex items-center justify-center ${className}`}>
      <Spline scene={scene} />
    </div>
  );
};
