const projects = document.querySelectorAll('.project-card');
const projectLists = document.querySelectorAll('.project-list');

let draggedItem = null;

projects.forEach(project => {
    project.addEventListener('dragstart', () => {
        draggedItem = project;
        setTimeout(() => {
            project.style.display = 'none';
        }, 0);
    });

    project.addEventListener('dragend', () => {
        setTimeout(() => {
            draggedItem.style.display = 'block';
            draggedItem = null;
        }, 0);
    });
});

projectLists.forEach(list => {
    list.addEventListener('dragover', e => {
        e.preventDefault();
    });

    list.addEventListener('dragenter', e => {
        e.preventDefault();
        list.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    });

    list.addEventListener('dragleave', () => {
        list.style.backgroundColor = 'transparent';
    });

    list.addEventListener('drop', () => {
        list.append(draggedItem);
        list.style.backgroundColor = 'transparent';
    });
});

const dropZones = document.querySelectorAll('.drop-zone');

dropZones.forEach(zone => {
    zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    });

    zone.addEventListener('dragleave', () => {
        zone.style.backgroundColor = 'transparent';
    });

    zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.style.backgroundColor = 'transparent';

        if (e.dataTransfer.files.length > 0) {
            const files = e.dataTransfer.files;
            // Handle dropped files
            console.log(files);
        }
    });
});
