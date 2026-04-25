// File: quiz-frontend/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quiz Online</h1>
          <p className="text-sm text-gray-500 mt-1">Hệ thống thi trắc nghiệm</p>
        </div>
        {children}
      </div>
    </div>
  );
}