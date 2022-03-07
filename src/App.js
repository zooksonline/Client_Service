import React, { useState, useEffect } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Fade } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";

// Main
import AppNavbar from "./components/main/AppNavbar";
import AppFooter from "./components/main/AppFooter";

// Main Page
import MainPage from "./components/Page/main/MainPage";

import Lottie from "react-lottie";

// Loading
import * as loadingData from "./utilis//lf30_editor_wvri0o27.json";

// Error Boundary
import { ErrorBoundary } from "react-error-boundary";
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>ระบบเกิดข้อผิดพลาด กรุณาเข้าใช้ใหม่หรือติดต่อเจ้าหน้าที่</p>
      <pre>{error.message}</pre>
      {/* <button onClick={resetErrorBoundary}>Try again</button> */}
    </div>
  );
}

const loadingOption = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const App = (props) => {
  const [loading, setloading] = useState(false);
  const [StartApp, setStartApp] = useState(true);
  const [fadeIn] = useState(true);
  const loadPage = useSelector((state) => state.main.trigger.load);
  const checkError = useSelector((state) => state.main.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if (checkError.status) {
      if (checkError.status === 400 || checkError.status === 401) {
        if (checkError.msg.msg !== "BuasriID ไม่มีอยู่ในระบบ Complaint") {
          dispatch({ type: "LOGOUT_SUCCESS" });
          alert("Session ของคุณหมดอายุ โปรด Login ใหม่");
        }
      }
    }
    // eslint-disable-next-line
  }, [checkError]);

  useEffect(() => {
    if (StartApp) {
      dispatch({ type: "PAGE_LOADING" });
      setStartApp(false);
    }
    // eslint-disable-next-line
  }, [StartApp]);

  useEffect(() => {
    if (loadPage) {
      setloading(true);
      setTimeout(() => {
        dispatch({ type: "PAGE_LOADED" });
      }, 1500);
    } else {
      setloading(false);
    }
    // eslint-disable-next-line
  }, [loadPage]);

  return (
    <div className="App">
      {loading ? (
        <Fade in={fadeIn}>
          <br />
          <br />
          <br />
          <br />
          <Lottie options={loadingOption} height={300} width={300}></Lottie>
          <h1 style={{ display: "flex", justifyContent: "center" }}>
            กำลังโหลดข้อมูล
          </h1>
        </Fade>
      ) : (
        <Fade in={fadeIn}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppNavbar />
            <br />
            <br />
            <br />
            <br />
            <MainPage />
            <br />
            <br />
            <br />
            <br />
            <AppFooter />
          </ErrorBoundary>
        </Fade>
      )}
    </div>
  );
};

export default connect(null, null)(App);
