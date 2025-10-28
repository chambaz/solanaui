const ComponentDemo = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-fd-card border border-border rounded-lg px-4 py-8 flex items-center justify-center">
      {children}
    </div>
  );
};

export { ComponentDemo };
