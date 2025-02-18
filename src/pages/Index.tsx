
const Index = () => {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl mb-4">Weak Website</h1>
      <p className="mb-4">Welcome to the vulnerable website demo.</p>
      <div className="space-x-4">
        <a href="/login" className="text-blue-500 hover:underline">Login</a>
        <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
      </div>
    </div>
  );
};

export default Index;
