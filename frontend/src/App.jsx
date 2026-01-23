import "./App.css";
import { BrowserRouter,Routes ,Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import HomeSection from "./pages/HomeSection";
import Footer from "./components/Footer";
import BookRatingPage from "./pages/BookRatingPage";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";

function App() {
  return (   
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<HomeSection/>} />
          <Route path="/book-rating" element ={<BookRatingPage/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<ContactUs/>}/>
        </Routes>
      <Footer/>  
      </BrowserRouter>
  );
}

export default App;
