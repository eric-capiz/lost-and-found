import { useState, useEffect } from "react";
import { FiGrid, FiList } from "react-icons/fi";
import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";
import Posts from "../components/posts/Posts";

const LAYOUT_KEY = "lostFound_home_luxe_layout";

function Home() {
  const [feedLayout, setFeedLayout] = useState(() => {
    try {
      const v = localStorage.getItem(LAYOUT_KEY);
      return v === "list" || v === "tiles" ? v : "tiles";
    } catch {
      return "tiles";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LAYOUT_KEY, feedLayout);
    } catch {
      /* ignore */
    }
  }, [feedLayout]);

  return (
    <div className="home-page home-page--luxe">
      <header className="luxe-hero">
        <div className="luxe-hero__wrap">
          <div className="luxe-hero__head">
            <div className="luxe-hero__masthead">
              <p className="luxe-hero__eyebrow">Signal · Registry</p>
              <h1 className="luxe-hero__title">Lost &amp; Found</h1>
              <span className="luxe-hero__rule" aria-hidden="true" />
              <p className="luxe-hero__tagline">
                Trace what vanished. Route what surfaced. One glass-clear
                command view—search, calibrate, hand off without the noise.
              </p>
            </div>
            <div className="luxe-hero__medallion" aria-hidden="true">
              <span className="luxe-hero__medallion-ring" />
              <span className="luxe-hero__medallion-ring luxe-hero__medallion-ring--lag" />
              <span className="luxe-hero__medallion-core">LF</span>
            </div>
          </div>
          <ul className="luxe-hero__cue-cards" aria-label="Quick cues">
            <li className="luxe-hero__cue luxe-hero__cue--indigo">
              <span className="luxe-hero__cue-label">Scan</span>
              <p>Pull signal from the header—titles, blurbs, instant reads.</p>
            </li>
            <li className="luxe-hero__cue luxe-hero__cue--rose">
              <span className="luxe-hero__cue-label">Calibrate</span>
              <p>
                Dial category, type, and sort order from the left rail—surgical
                focus.
              </p>
            </li>
            <li className="luxe-hero__cue luxe-hero__cue--cyan">
              <span className="luxe-hero__cue-label">Thread</span>
              <p>Drop a line on a post—coordinate a meet, close the loop.</p>
            </li>
          </ul>
        </div>
      </header>

      <div className="luxe-stage">
        <aside
          className="luxe-rail luxe-rail--west"
          aria-label="Filters and sorting"
        >
          <LeftSidebar />
        </aside>

        <div className="luxe-main">
          <div className="luxe-toolbar">
            <span className="luxe-toolbar__label">Live floor</span>
            <div className="luxe-switch" role="group" aria-label="Post layout">
              <button
                type="button"
                className={
                  feedLayout === "tiles"
                    ? "luxe-switch__btn is-active"
                    : "luxe-switch__btn"
                }
                onClick={() => setFeedLayout("tiles")}
                aria-pressed={feedLayout === "tiles"}
              >
                <FiGrid aria-hidden />
                Tiles
              </button>
              <button
                type="button"
                className={
                  feedLayout === "list"
                    ? "luxe-switch__btn is-active"
                    : "luxe-switch__btn"
                }
                onClick={() => setFeedLayout("list")}
                aria-pressed={feedLayout === "list"}
              >
                <FiList aria-hidden />
                Feed
              </button>
            </div>
          </div>

          <main className="luxe-feed" id="main-content">
            <Posts view="home" layout={feedLayout} />
          </main>
        </div>

        <aside className="luxe-rail luxe-rail--east" aria-label="Community">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
}

export default Home;
