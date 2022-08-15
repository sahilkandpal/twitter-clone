import Router from "next/router";
import SigninLoader from "../components/SigninLoader";
import { useAuthContext } from "../context/authContext";

function withPublic(Component: React.FC<any>) {
  return function WithProtected(props: any) {
    const { auth } = useAuthContext();

    if (auth == "loading") return <SigninLoader />;

    if (auth == "authenticated") {
      Router.replace("/home");
    } else {
      return <Component {...props} />;
    }
  };
}

export default withPublic;
