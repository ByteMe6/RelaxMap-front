import "./Container.scss";

interface ContainerProps {
  children: React.ReactNode;
  isHeader?: boolean;
  isLogin?: boolean;
}

export default function Container({ children, isHeader = false, isLogin = false }: ContainerProps) {
  return (
    <div className={`container ${isHeader ? "headerCont" : ""} ${isLogin ? "loginCont" : ""}`}>
      {children}
    </div>
  );
}