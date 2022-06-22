import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import SignIn from "../pages/sign.in";
import SignUp from "../pages/sign.up";
import Categories from "../pages/categories";
import Category from "../pages/category";
import SubCategory from "../pages/subCategory";
import AllSubCategories from "../pages/subCategories";
import AllFlashCards from "../pages/flashcards";
import Home from "../pages/home";
import DashboardView from "../pages/dashboardView";

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<AllFlashCards />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/:id" element={<Category />} />
            <Route
              path="categories/:id/subCategory/:subCategoryId"
              element={<SubCategory />}
            />
            <Route path="subCategories" element={<AllSubCategories />} />
            <Route
              path="subCategories/:subCategoryId"
              element={<SubCategory />}
            />
            <Route path="flashCards" element={<AllFlashCards />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
