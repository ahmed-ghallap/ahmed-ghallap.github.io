$(document).ready(() => {
    const openIcon = $("#open-icon");
    const closeIcon = $("#close-icon");
    const dropdown = $(".dropdown-menu");

    var fun = () => {
        openIcon.toggle()
        closeIcon.toggle()
        dropdown.toggle(200)
    };
    openIcon.click(fun)
    closeIcon.click(fun)

});