import os
import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
    page_title="AFTERBURNER — Aerospace & Defence Intelligence",
    page_icon="🔥",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Hide Streamlit chrome so only the site shows
st.markdown(
    """
    <style>
        #MainMenu, footer, header { visibility: hidden; }
        .block-container { padding: 0 !important; max-width: 100% !important; }
        section[data-testid="stSidebar"] > div:first-child {
            background: #0d1526;
            border-right: 1px solid rgba(255,255,255,0.07);
        }
    </style>
    """,
    unsafe_allow_html=True,
)

BASE = os.path.dirname(os.path.abspath(__file__))


def read(rel_path: str) -> str:
    with open(os.path.join(BASE, rel_path), encoding="utf-8") as f:
        return f.read()


def build_page(html_file: str) -> str:
    """Load an HTML page and inline its CSS and JS so Streamlit can render it."""
    html = read(html_file)
    css  = read("css/styles.css")
    js   = read("js/main.js")
    html = html.replace(
        '<link rel="stylesheet" href="css/styles.css" />',
        f"<style>{css}</style>",
    )
    html = html.replace(
        '<script src="js/main.js"></script>',
        f"<script>{js}</script>",
    )
    return html


PAGES = {
    "🏠  Home":           "index.html",
    "📰  Articles":       "articles.html",
    "🎬  Videos":         "videos.html",
    "🎙️  Podcasts":       "podcasts.html",
    "📊  Data":           "data.html",
    "📽️  Presentations":  "presentations.html",
}

# ── Sidebar navigation ──────────────────────────────────────────────────────
with st.sidebar:
    st.markdown(
        "<h2 style='color:#ff5722;font-family:Impact,sans-serif;"
        "letter-spacing:0.04em;margin-bottom:2px'>🔥 AFTERBURNER</h2>"
        "<p style='color:#4e5c70;font-size:11px;text-transform:uppercase;"
        "letter-spacing:0.14em;margin-top:0'>Aerospace & Defence Intelligence</p>",
        unsafe_allow_html=True,
    )
    st.divider()
    choice = st.radio(
        "Navigate",
        list(PAGES.keys()),
        label_visibility="collapsed",
    )
    st.divider()
    st.caption("Use the menu above to navigate between sections.")
    st.caption("Internal site nav links open within this viewer.")

# ── Render selected page ─────────────────────────────────────────────────────
components.html(build_page(PAGES[choice]), height=8000, scrolling=True)
