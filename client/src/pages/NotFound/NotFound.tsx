import { Central as Layout } from "@/layouts";
import "./NotFound.style.scss";
import homer404 from "@/Gifs/homer404.gif"
function NotFound() {
  return (
    <Layout title={"Page Not Found"}>
      <div className="not-found-container">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">
          Oops! The page you're looking for doesn't exist.
        </p>
        <img src={homer404} alt="404 GIF" className="not-found-gif" />
      </div>
    </Layout>
  );
}

export default NotFound;
