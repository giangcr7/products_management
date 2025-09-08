// Xử lý button status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
    // LẤY URL
    let url = new URL(window.location.href);
    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {

            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status);
            }
            else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    });
}

// end xử lý button status

// Xử lý tìm kiếm

const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set("keyword", keyword);
        }
        else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
}

// end xử lý tìm kiếm

// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination.length > 0) {
    // LẤY URL
    let url = new URL(window.location.href);
    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {

            const page = button.getAttribute("button-pagination");
            if (page) {
                url.searchParams.set("page", page);
            }
            window.location.href = url.href;
        });
    });
}
// end pagination

// CheckBox-Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true;
            }
            )
        } else {
            inputsId.forEach(input => {
                input.checked = false;
            })
        }
    });
    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            }
            else {
                inputCheckAll.checked = false;

            }

        });
    });
}
// End CheckBox-Multi


// FORM CHANGE MULTI
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {

        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

        const typeChange = e.target.type.value;
        let isConfirm = true;
        if (typeChange === "delete-all") {
            isConfirm = confirm("Bạn có chắc chắn muốn xoá những sản phẩm này?");
        }
        if (!isConfirm) {
            return;
        }


        if (inputChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputChecked.forEach(input => {
                const id = input.value;
                ids.push(id);
            });
            inputIds.value = ids.join(", ");

            formChangeMulti.submit();

        }
        else {
            alert("Vui lòng chọn ít nhất một sản phẩm");
        }
    });
}

// END FORM CHANGE MULTI
