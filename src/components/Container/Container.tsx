import "./Container.scss";

interface ContainerProps {
  children: React.ReactNode;
  isHeader?: boolean;
}

export default function Container({ children, isHeader = false }: ContainerProps) {
  return (
    <div className={`container ${isHeader ? "headerCont" : ""}`}>
      {children}
    </div>
  );
}