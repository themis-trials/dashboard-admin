<?php

declare(strict_types=1);

// ==========================================================
// CONFIGURATION
// ==========================================================

const GITHUB_API_URL = 'https://api.github.com/repos/PokeAPI/sprites/contents/';
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/';

$subfolders = [
    'badges' => [],
    'items' => [
        'berries',
        'dream-world',
        'gen3',
        'gen5',
        'gen8',
        'gen9',
    ],
    'marks' => [
        'generation-ix',
        'generation-vii',
    ],
    'pokemon' => [],
    'ribbons' => [
        'generation-iii',
        'generation-iv',
        'generation-ix',
        'generation-v',
        'generation-vi',
        'generation-vii',
        'generation-viii',
    ],
    'types' => [
        'generation-iii',
        'generation-iv',
        'generation-ix',
        'generation-v',
        'generation-vi',
        'generation-vii',
        'generation-viii',
    ],
];

$categories = array_keys($subfolders);

$selectedCategory = $_POST['category'] ?? '';
$selectedFolders = $_POST['folders'] ?? [];
$search = trim($_POST['search'] ?? '');

$sprites = [];
$folders = [];
$error = null;
$loaded = false;

// ==========================================================
// FONCTIONS
// ==========================================================

// = Échapper le HTML.
function escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

// = Récupérer le contenu d'un dossier GitHub.
function fetchGitHubContents(string $path): array
{
    $url = GITHUB_API_URL
        . implode('/', array_map('rawurlencode', explode('/', $path)))
        . '?ref=master';

    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => implode("\r\n", [
                'Accept: application/vnd.github+json',
                'User-Agent: Themis-Sprites-Gallery',
            ]),
            'timeout' => 30,
        ],
    ]);

    $response = @file_get_contents($url, false, $context);

    if ($response === false) {
        throw new RuntimeException(
            "Impossible de récupérer le dossier « {$path} » depuis GitHub."
        );
    }

    $data = json_decode($response, true);

    if (!is_array($data) || isset($data['message'])) {
        throw new RuntimeException(
            $data['message'] ?? 'Réponse GitHub invalide.'
        );
    }

    return $data;
}

// = Construire l'URL d'un sprite.
function buildSpriteUrl(string $path): string
{
    return GITHUB_RAW_URL
        . implode('/', array_map('rawurlencode', explode('/', $path)));
}

// = Récupérer uniquement les PNG directement dans un dossier.
function fetchDirectSprites(string $path): array
{
    $sprites = [];

    foreach (fetchGitHubContents($path) as $entry) {
        if (
            ($entry['type'] ?? '') !== 'file'
            || !preg_match('/\.png$/i', $entry['name'] ?? '')
        ) {
            continue;
        }

        $sprites[] = [
            'name' => $entry['name'],
            'path' => $entry['path'],
            'folder' => dirname($entry['path']),
            'url' => buildSpriteUrl($entry['path']),
        ];
    }

    return $sprites;
}

// = Explorer récursivement un dossier.
function fetchSpritesFromDirectory(string $path): array
{
    $sprites = [];

    foreach (fetchGitHubContents($path) as $entry) {
        if (!isset($entry['type'], $entry['path'])) {
            continue;
        }

        if ($entry['type'] === 'dir') {
            $sprites = array_merge(
                $sprites,
                fetchSpritesFromDirectory($entry['path'])
            );

            continue;
        }

        if (
            $entry['type'] !== 'file'
            || !preg_match('/\.png$/i', $entry['name'] ?? '')
        ) {
            continue;
        }

        $sprites[] = [
            'name' => $entry['name'],
            'path' => $entry['path'],
            'folder' => dirname($entry['path']),
            'url' => buildSpriteUrl($entry['path']),
        ];
    }

    return $sprites;
}

// ==========================================================
// TRAITEMENT DU FORMULAIRE
// ==========================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (
        !is_string($selectedCategory)
        || !isset($subfolders[$selectedCategory])
    ) {
        $error = 'Sélectionne une catégorie valide.';
    } elseif (!is_array($selectedFolders)) {
        $error = 'Sélection de dossiers invalide.';
    } else {
        $availableFolders = $subfolders[$selectedCategory];

        // = Vérifier les sélections reçues.
        $validSelection = array_values(array_filter(
            $selectedFolders,
            static fn($folder): bool =>
            is_string($folder)
                && (
                    $folder === '__root__'
                    || in_array($folder, $availableFolders, true)
                )
        ));

        if (count($validSelection) !== count($selectedFolders)) {
            $error = 'La sélection contient un dossier invalide.';
        } elseif ($validSelection === []) {
            $error = 'Sélectionne au moins un dossier à charger.';
        } else {
            $basePath = 'sprites/' . $selectedCategory;

            try {
                foreach (array_unique($validSelection) as $folder) {
                    if ($folder === '__root__') {
                        // = PNG directement dans le dossier parent.
                        $sprites = array_merge(
                            $sprites,
                            fetchDirectSprites($basePath)
                        );

                        continue;
                    }

                    // = PNG du sous-dossier et de ses descendants.
                    $sprites = array_merge(
                        $sprites,
                        fetchSpritesFromDirectory(
                            $basePath . '/' . $folder
                        )
                    );
                }

                // = Supprimer les éventuels doublons.
                $uniqueSprites = [];

                foreach ($sprites as $sprite) {
                    $uniqueSprites[$sprite['path']] = $sprite;
                }

                $sprites = array_values($uniqueSprites);

                // = Trier les sprites.
                usort(
                    $sprites,
                    fn(array $a, array $b): int =>
                    strnatcasecmp($a['path'], $b['path'])
                );

                $folders = array_values(
                    array_unique(array_column($sprites, 'folder'))
                );

                sort($folders, SORT_NATURAL | SORT_FLAG_CASE);

                $loaded = true;
            } catch (RuntimeException $exception) {
                $error = $exception->getMessage();
                $sprites = [];
            }
        }
    }
}

// = Filtrer les sprites après leur récupération.
$filteredSprites = array_values(array_filter(
    $sprites,
    static fn(array $sprite): bool =>
    $search === ''
        || stripos($sprite['name'], $search) !== false
        || stripos($sprite['path'], $search) !== false
));

?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>PokéAPI Sprites — Themis Trials</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 2rem;
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            color: #222;
        }

        .gallery {
            max-width: 1400px;
            margin: 0 auto;
        }

        .gallery__header {
            margin-bottom: 2rem;
        }

        .gallery__form {
            display: flex;
            flex-wrap: wrap;
            align-items: end;
            gap: 1rem;
            padding: 1.25rem;
            background: white;
            border-radius: 0.75rem;
            margin-bottom: 1.5rem;
        }

        .gallery__field {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .gallery__field select,
        .gallery__field input,
        .gallery__button {
            min-height: 42px;
            padding: 0.65rem 0.85rem;
            border: 1px solid #ccc;
            border-radius: 0.4rem;
            font: inherit;
        }

        .gallery__button {
            cursor: pointer;
            background: #252525;
            color: white;
            border-color: #252525;
        }

        .gallery__button:hover {
            background: #444;
        }

        .gallery__status {
            margin: 1rem 0;
        }

        .gallery__error {
            padding: 1rem;
            background: #ffe8e8;
            color: #a00000;
            border-radius: 0.5rem;
        }

        .gallery__filters {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.75rem;
            min-width: 0;
            padding: 1rem;
            border: 1px solid #ddd;
            border-radius: 0.5rem;
        }

        .gallery__filters legend {
            padding: 0 0.4rem;
            font-weight: bold;
        }

        #sprite-folder-filters {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            width: 100%;
        }

        .gallery__checkbox {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
        }

        .gallery__filters button {
            padding: 0.4rem 0.65rem;
            cursor: pointer;
        }

        .gallery__grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
        }

        .sprite {
            min-width: 0;
            padding: 0.75rem;
            background: white;
            border: 1px solid #e5e5e5;
            border-radius: 0.5rem;
            text-align: center;
        }

        .sprite__preview {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 120px;
            margin-bottom: 0.75rem;
            overflow: hidden;
            background-color: #fafafa;
            background-image:
                linear-gradient(45deg, #eee 25%, transparent 25%),
                linear-gradient(-45deg, #eee 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #eee 75%),
                linear-gradient(-45deg, transparent 75%, #eee 75%);
            background-size: 16px 16px;
            background-position:
                0 0, 0 8px, 8px -8px, -8px 0;
        }

        .sprite__image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            image-rendering: pixelated;
        }

        .sprite__name {
            margin-bottom: 0.4rem;
            overflow-wrap: anywhere;
            font-size: 0.9rem;
            font-weight: bold;
        }

        .sprite__path {
            margin-bottom: 0.6rem;
            color: #777;
            font-size: 0.75rem;
            overflow-wrap: anywhere;
        }

        .sprite__link {
            font-size: 0.8rem;
        }

        @media (max-width: 600px) {
            body {
                padding: 1rem;
            }

            .gallery__form {
                align-items: stretch;
                flex-direction: column;
            }
        }
    </style>
</head>

<body>
    <main class="gallery">
        <header class="gallery__header">
            <h1>PokéAPI Sprites</h1>
            <p>Explorer les sprites du dépôt PokeAPI sans les héberger localement.</p>
        </header>

        <form class="gallery__form" method="post">
            <div class="gallery__field">
                <label for="sprite-category">Catégorie</label>

                <select id="sprite-category" name="category" required>
                    <option value="">Choisir une catégorie</option>

                    <?php foreach ($categories as $category): ?>
                        <option
                            value="<?= escape($category) ?>"
                            <?= $selectedCategory === $category ? 'selected' : '' ?>>
                            <?= escape(ucfirst($category)) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <fieldset class="gallery__filters">
                <legend>Dossiers à charger</legend>

                <div id="sprite-folder-filters">
                    <?php if ($selectedCategory !== ''): ?>
                        <label class="gallery__checkbox">
                            <input
                                type="checkbox"
                                name="folders[]"
                                value="__root__"
                                <?= in_array('__root__', $selectedFolders, true) ? 'checked' : '' ?>>
                            Sans sous-dossier
                        </label>

                        <?php foreach ($subfolders[$selectedCategory] as $subfolder): ?>
                            <label class="gallery__checkbox">
                                <input
                                    type="checkbox"
                                    name="folders[]"
                                    value="<?= escape($subfolder) ?>"
                                    <?= in_array($subfolder, $selectedFolders, true) ? 'checked' : '' ?>>
                                <?= escape($subfolder) ?>
                            </label>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p>Choisis une catégorie pour afficher ses filtres.</p>
                    <?php endif; ?>
                </div>

                <button type="button" id="sprite-select-all">
                    Tout sélectionner
                </button>

                <button type="button" id="sprite-deselect-all">
                    Tout désélectionner
                </button>
            </fieldset>

            <div class="gallery__field">
                <label for="sprite-search">Rechercher un sprite</label>

                <input
                    id="sprite-search"
                    type="search"
                    name="search"
                    value="<?= escape($search) ?>"
                    placeholder="Nom ou chemin..."
                    <?= $loaded ? '' : 'disabled' ?>>
            </div>

            <button class="gallery__button" type="submit">
                Charger les sprites
            </button>
        </form>

        <?php if ($error !== null): ?>
            <p class="gallery__error"><?= escape($error) ?></p>

        <?php elseif ($loaded): ?>
            <p class="gallery__status">
                <?= count($filteredSprites) ?> sprite(s) affiché(s)
                sur <?= count($sprites) ?> dans
                <strong><?= escape($selectedCategory) ?></strong>.
            </p>

            <?php if ($sprites === []): ?>
                <p>Aucun fichier PNG trouvé dans cette sélection.</p>

            <?php elseif ($filteredSprites === []): ?>
                <p>Aucun sprite ne correspond à cette recherche.</p>

            <?php else: ?>
                <section class="gallery__grid">
                    <?php foreach ($filteredSprites as $sprite): ?>
                        <article class="sprite">
                            <a
                                class="sprite__preview"
                                href="<?= escape($sprite['url']) ?>"
                                target="_blank"
                                rel="noopener noreferrer">
                                <img
                                    class="sprite__image"
                                    src="<?= escape($sprite['url']) ?>"
                                    alt="<?= escape($sprite['name']) ?>"
                                    loading="lazy">
                            </a>

                            <div class="sprite__name">
                                <?= escape($sprite['name']) ?>
                            </div>

                            <div class="sprite__path">
                                <?= escape($sprite['path']) ?>
                            </div>

                            <a
                                class="sprite__link"
                                href="<?= escape($sprite['url']) ?>"
                                target="_blank"
                                rel="noopener noreferrer">
                                Voir l'image originale
                            </a>
                        </article>
                    <?php endforeach; ?>
                </section>
            <?php endif; ?>

        <?php else: ?>
            <p class="gallery__status">
                Choisis une catégorie, coche les dossiers à charger,
                puis clique sur « Charger les sprites ».
            </p>
        <?php endif; ?>
    </main>

    <script>
        const subfolders = <?= json_encode(
                                $subfolders,
                                JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP
                            ) ?>;

        const categorySelect = document.querySelector("#sprite-category");
        const folderFilters = document.querySelector("#sprite-folder-filters");

        // = Actualiser les cases à cocher selon la catégorie.
        categorySelect.addEventListener("change", () => {
            const category = categorySelect.value;
            const folders = subfolders[category] || [];

            folderFilters.replaceChildren();

            if (!category) {
                const message = document.createElement("p");
                message.textContent = "Choisis une catégorie pour afficher ses filtres.";
                folderFilters.appendChild(message);
                return;
            }

            const options = [{
                    value: "__root__",
                    label: "Sans sous-dossier"
                },
                ...folders.map(folder => ({
                    value: folder,
                    label: folder
                }))
            ];

            options.forEach(option => {
                const label = document.createElement("label");
                label.className = "gallery__checkbox";

                const input = document.createElement("input");
                input.type = "checkbox";
                input.name = "folders[]";
                input.value = option.value;

                label.append(input, document.createTextNode(option.label));
                folderFilters.appendChild(label);
            });
        });

        // = Tout sélectionner.
        document.querySelector("#sprite-select-all").addEventListener("click", () => {
            folderFilters.querySelectorAll('input[type="checkbox"]')
                .forEach(input => input.checked = true);
        });

        // = Tout désélectionner.
        document.querySelector("#sprite-deselect-all").addEventListener("click", () => {
            folderFilters.querySelectorAll('input[type="checkbox"]')
                .forEach(input => input.checked = false);
        });
    </script>
</body>

</html>