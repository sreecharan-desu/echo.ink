import {motion} from "framer-motion"

export default function LoadingAnimation(){
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <motion.div
          className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />
      </div>
    );
  };
  