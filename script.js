const Storage = {
    key: "notes",
    get(){
        const notes = JSON.parse(localStorage.getItem(this.key))
        return notes !== null ? notes : [];
    },
    save(notes){
        localStorage.setItem(this.key, JSON.stringify(notes));
    },
}

const state = {
    notes: Storage.get(),
}

const creatingNoteText = (text, isChanging) => (
    text.trim() ? (()=>(text.length > 126 && isChanging ? text.slice(0, 125) + "..." : text))()  : "Your note..."
)

const creatingNote = (text, order, isChanging, onChange, onApply, onEdit, onRemove) => {

    const note = document.createElement("div");
    note.classList.add("note");

    note.innerHTML = `
        <span><small class="order">${order}</small></span>
        <h3>${creatingNoteText(text, isChanging)}</h3>
        <div class="note_btns_wrapper">
            <button class="remove btn hide">x</button>
           
        </div>
    `

    const buttons_wrapper =  note.children[2];

    if(isChanging) {
        const textarea = document.createElement("textarea");
        textarea.oninput = onChange;
        textarea.value = text;
        note.children[1].insertAdjacentElement("afterend", textarea);

        const applyBtn = document.createElement("button");
        applyBtn.onclick = onApply;
        applyBtn.classList.add("btn", "apply");
        buttons_wrapper.insertAdjacentElement("afterbegin", applyBtn);

        const removeBtn = document.createElement("button");
        removeBtn.innerHTML = "x";
        removeBtn.onclick = onRemove;
        removeBtn.classList.add("btn", "remove");
        buttons_wrapper.insertAdjacentElement("afterbegin", removeBtn);

    } else {
        note.onmouseenter = () => editBtn.classList.remove("hide");
        note.onmouseleave = () => editBtn.classList.add("hide");

        const editBtn = document.createElement("button");
        editBtn.onclick = onEdit;
        editBtn.innerHTML = '✎';
        editBtn.classList.add(..."btn edit hide".split(" "));
        buttons_wrapper.insertAdjacentElement("beforebegin", editBtn);
    }

    return note;
}

const addNewNote = () => {
    state.notes.push({
        text: "",
        isChanging: true,
    })
    render(state.notes)
}

const onNoteInputChange = (state_link) => {
    return (e) => {
        e.target.previousSibling.innerHTML = creatingNoteText(e.target.value, true);
        state_link.text = e.target.value;
    }
}

const onNoteApply = (state_link) => {
    state_link.isChanging = false;
    render(state.notes);
}

const onNoteEdit = (state_link) => {
    state_link.isChanging = true;
    render(state.notes);
}

const onNoteRemove = (index) => {
    state.notes.splice(index, 1);
    render(state.notes);
}


const render = (notes) => {
    const notes_wrapper = document.querySelector(".notes_wrapper");
    notes_wrapper.innerHTML = "";
    notes.forEach((note, index) => {
        const element = creatingNote(
            note.text,
            `${index + 1}/${notes.length}`,
            note.isChanging,
            onNoteInputChange(note),
            onNoteApply.bind(this, note),
            onNoteEdit.bind(this, note),
            onNoteRemove.bind(this, index),
        );
        notes_wrapper.insertAdjacentElement("afterbegin", element);
    })
}


render(state.notes);

window.onbeforeunload = () => {
    Storage.save(state.notes)
}