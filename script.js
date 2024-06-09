document.addEventListener('DOMContentLoaded', () => {
    const modulesContainer = document.getElementById('modulesContainer');
    const searchBox = document.getElementById('searchBox');
    const selectAllCheckbox = document.getElementById('selectAll');
    const deleteButton = document.getElementById('deleteButton');
    const downloadButton = document.getElementById('downloadButton');
    let modules = [];

    fetch('module.json')
        .then(response => response.json())
        .then(data => {
            modules = data;
            renderModules(modules);
        });

    function renderModules(modules) {
        modulesContainer.innerHTML = '';
        modules.forEach((module, index) => {
            const moduleCard = document.createElement('div');
            moduleCard.className = 'flex items-center justify-between bg-white p-4 my-2';
            moduleCard.innerHTML = `
                <div class="flex items-center gap-1 md:gap-4">
                    <input data-index="${index}" type="checkbox" id="selectAll" class="module-checkbox mr-2 md:h-8 md:w-8 text-xl" style="accent-color: #891716;" >
                    <span>${module.file_type == 'file' ? '<i class="fas fa-file text-blue-900 md:text-xl"></i>' : '<i class="fas fa-play text-blue-900 text-xl"></i>'}</span>
                    <div>
                        <h1 class="text-sm md:text-xl font-bold capitalize mb-0 text-red-900">${module.file_name}</h1>
                        <p class="text-gray-500 text-xs md:text-base font-semibold mt-0">Last Modified on ${module.last_modified}</p>
                    </div>
                </div>
                <div class="flex items-center gap-1 md:gap-4 md:w-40" >
                    <a href="${module.file_path}" download="${module.file_name}" class="cursor-pointer text-red-900 text-xl">
                        <i class="fas fa-download"></i>
                    </a>
                    <button class="text-red-900 text-xl" onclick="viewModule('${module.file_type}', '${module.file_path}')" > <i class="fas fa-play"></i> </button>
                    <h2 class="text-gray-600">${module.file_size}</h2>
                </div>
            `;
            modulesContainer.appendChild(moduleCard);
        });
    }

    searchBox.addEventListener('input', () => {
        const filteredModules = modules.filter(module =>
            module.file_name.toLowerCase().includes(searchBox.value.toLowerCase())
        );
        renderModules(filteredModules);
    });

    selectAllCheckbox.addEventListener('change', () => {
        document.querySelectorAll('.module-checkbox').forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });

    deleteButton.addEventListener('click', () => {
        const selectedModules = document.querySelectorAll('.module-checkbox:checked');
        selectedModules.forEach(checkbox => {
            modules.splice(checkbox.dataset.index, 1);
        });
        renderModules(modules);
    });

    downloadButton.addEventListener('click', () => {
        const selectedModules = document.querySelectorAll('.module-checkbox:checked');
        selectedModules.forEach(checkbox => {
            const module = modules[checkbox.dataset.index];
            const link = document.createElement('a');
            link.href = module.file_path;
            link.download = module.file_name;
            link.click();
        });
    });
});

function viewModule(type, path) {
    if (type === 'video') {
        document.getElementById('videoPlayer').src = path;
        document.getElementById('videoModal').classList.remove('hidden');
    } else if (type === 'file') {
        document.getElementById('fileViewer').src = path;
        document.getElementById('fileModal').classList.remove('hidden');
    }
}

function closeVideoModal() {
    document.getElementById('videoPlayer').src = '';
    document.getElementById('videoModal').classList.add('hidden');
}

function closeFileModal() {
    document.getElementById('fileViewer').src = '';
    document.getElementById('fileModal').classList.add('hidden');
}
