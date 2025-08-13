import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function SignInSignUp() {
  const location = useLocation();

  // Form mode based on route
  const [isSignUp, setIsSignUp] = useState(location.pathname === "/signUp");

  useEffect(() => {
    setIsSignUp(location.pathname === "/signUp");
  }, [location.pathname]);

  // Slideshow
  const images = [
    "/src/Ntando.jpeg",
    "/src/Ntando2.jpeg",
    "/src/Ntando3.jpeg",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Form state
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    console.log({
      fullname,
      email,
      password,
      confirmPassword,
    });
    
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cce6f4 to-[#1a6847]">
      {/* Header */}
      <header className="p-4 sm:px-8">
        <h1 className="text-2xl font-bold text-[#0c7b32]">PlanIt</h1>
      </header>

      <main className="flex-1 flex justify-center items-center p-4 md:p-8">
        <div className="flex sm:flex-row flex-col w-[60vw] bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1.5">
          
          {/* Image Section */}
          <div className="md:w-1/2 relative bg-gray-100 overflow-hidden min-h-[400px]">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Slide ${index + 1}`}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out transform ${
                  index === currentIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }`}
              />
            ))}
          </div>

          {/* Form Section */}
          <div className="md:w-1/2 min-h-[400px] flex flex-col items-center p-8 md:p-10">
            <h2 className="text-2xl font-bold text-[#006400] mb-5">
              {isSignUp ? "Sign Up" : "Sign In"}
            </h2>

            <form className="flex flex-col w-full space-y-3" onSubmit={handleSubmit}>
              {isSignUp && (
                <input
                  type="text"
                  placeholder="Fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                  className="p-3 border rounded-md border-gray-300 text-sm"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-3 border rounded-md border-gray-300 text-sm"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-3 border rounded-md border-gray-300 text-sm"
              />
              {isSignUp && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`p-3 border rounded-md border-gray-300 text-sm ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-500"
                      : ""
                  }`}
                />
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="bg-[#66c0e8] hover:bg-[#57aed4] text-white font-bold py-3 rounded-md transition-colors"
              >
                {isSignUp ? "Create account" : "Sign In"}
              </button>
            </form>

            <div className="my-4 font-bold text-gray-500">OR</div>

            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 w-full mb-2 hover:bg-gray-100 transition-colors">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg"
                alt="Google logo"
                className="h-4"
              />
              {isSignUp ? "Sign Up with Google" : "Sign In with Google"}
            </button>

            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 w-full mb-2 hover:bg-gray-100 transition-colors">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="Microsoft logo"
                className="h-4"
              />
              {isSignUp ? "Sign Up with Microsoft" : "Sign In with Microsoft"}
            </button>

            <p className="mt-3 text-sm">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-blue-600 hover:underline bg-none border-none p-0"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="text-blue-600 hover:underline bg-none border-none p-0"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
