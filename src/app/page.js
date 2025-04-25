import Navbar from "./components/navbar";

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <h1>Welcome to The African Wave</h1>
        <p>Shaping narratives</p>
      </div>
    </>
  );
}