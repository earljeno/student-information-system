// Load or Create Database
let request = indexedDB.open("StudentInformation", 2);

request.onerror = e => console.error(`Error: ${e.target.error}`);
request.onsuccess = e => console.log(`DB Ready: ${e.target.result}`);

loadStudents();

request.onupgradeneeded = e => {
    let db = e.target.result;

    let store =  db.createObjectStore("student", { keyPath: "id", autoIncrement: true });

    store.createIndex("idIndex", "studentId", { unique: true });
    store.createIndex("nameIndex", "fullName", { unique: false });
    store.createIndex("courseIndex", "course", { unique: false});
    store.createIndex("yearIndex", "yearLevel", { unique: false });
}

// Load Students in Table Body
function loadStudents() {
    let request = indexedDB.open("StudentInformation", 2);

    request.onsuccess = function(e) {
        let db = e.target.result;
        let tx = db.transaction("student", "readonly");
        let store = tx.objectStore("student");
        
        const request = store.getAll();

        request.onsuccess = function(e) {
            const students = e.target.result;
            const tbody = document.getElementById('tableData')
            tbody.innerHTML = "";

            students.forEach(student => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${student.fullName}</td>
                    <td>${student.studentId}</td>
                    <td>${student.course}</td>
                    <td>${student.yearLevel}</td>
                    <td>${student.email}</td>
                    <td>
                    <!-- <button class="btn btn-primary">View</button> -->
                    <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#editUserModal">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal">
                        <i class="bi bi-trash"></i>
                    </button>
                    </td>
                `;

                tbody.appendChild(tr);
            })
        }
    }

    console.log("Students Loaded!")
}

// Add Student
document.getElementById('addStudentForm').addEventListener('submit', function(e) {
    e.preventDefault()
    const modalEl = document.getElementById('addStudentModal');
    const modal = bootstrap.Modal.getInstance(modalEl);

    const fullName =  document.getElementById('fullNameInput').value;
    const id =  document.getElementById('idInput').value;
    const course =  document.getElementById('courseInput').value;
    const yearLevel =  document.getElementById('yearLevelInput').value;
    const email =  document.getElementById('emailInput').value;

    let request = indexedDB.open("StudentInformation", 2);

    request.onsuccess = function(e) {
        let db = e.target.result;
        let tx = db.transaction("student", "readwrite");
        let store = tx.objectStore("student");
        let data = {
            studentId: id,
            fullName: fullName,
            course: course,
            yearLevel: yearLevel,
            email: email
        };

        store.add(data);
    }

        fullName.value = "";
        id.value = "";
        course.value = "";
        yearLevel.value = "";
        email.value = "";
        
        modal.hide()
        loadStudents()
});

// Edit Student

// Delete Student