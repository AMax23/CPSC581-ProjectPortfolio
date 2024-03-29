const URL = location.origin; // root domain

// P0 go page
$("#go-p0").on("click", e => {
    window.location.assign(`${URL}/pages/p0.html`);
});

// P0 Details page
$("#det-p0").on("click", e => {
    window.location.assign(`${URL}/pages/p0Details.html`);
});

// P0 source page --> Github repo
$("#src-p0").on("click", e => {
    window.location.href = "https://github.com/AMax23/CPSC581-ProjectPortfolio";
});

//////////////////////////////////////////////////////////////////////
// P1 go page
$("#go-p1").on("click", e => {
    window.location.assign(`${URL}/pages/p1.html`);
});

// P1 Details page
$("#det-p1").on("click", e => {
    window.location.assign(`${URL}/pages/p1Details.html`);
});

// P1 source page --> Github repo
$("#src-p1").on("click", e => {
    window.location.href = "https://github.com/AMax23/CPSC581-ProjectPortfolio";
});

//////////////////////////////////////////////////////////////////////
// P2 go page
$("#go-p2").on("click", e => {
    window.location.assign(`${URL}/pages/p2.html`);
});

// P2 Details page
$("#det-p2").on("click", e => {
    window.location.assign(`${URL}/pages/p2Details.html`);
});

// P1 source page --> Github repo
$("#src-p2").on("click", e => {
    window.location.href = "https://github.com/AMax23/CPSC581-ProjectPortfolio";
});

//////////////////////////////////////////////////////////////////////