import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to dashboard since this is the main entry point
  return <Navigate to="/" replace />;
};

export default Index;
