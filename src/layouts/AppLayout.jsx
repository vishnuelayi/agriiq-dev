const AppLayout = ({
    title,
    actions,
    children,
  }) => {
    return (
      <div className="min-h-screen bg-[color:var(--color-bg)]">
        {/* HEADER */}
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">
              {title}
            </h1>
  
            <div className="flex items-center gap-2">
              {actions}
            </div>
          </div>
        </header>
  
        {/* CONTENT */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    );
  };
  
  export default AppLayout;
  