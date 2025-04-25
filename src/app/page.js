import SignUp from "./components/sign-up";
import SignIn from "./components/sign-in";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1>Welcome to The African Wave</h1>
      <p>Shaping narratives</p>
      
      {/* <SignUp /> */}
      <SignIn />
    </div>
  );
}