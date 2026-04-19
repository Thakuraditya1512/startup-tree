import fs from 'fs';
import path from 'path';

const replaceMap = {
    "bg-white": "bg-background",
    "bg-stone-50": "bg-muted",
    "bg-stone-50/50": "bg-muted/50",
    "bg-gray-50": "bg-muted",
    "bg-gray-50/50": "bg-muted/50",
    "bg-gray-100": "bg-muted",
    "text-stone-900": "text-foreground",
    "text-gray-900": "text-foreground",
    "text-stone-700": "text-card-foreground",
    "text-gray-700": "text-card-foreground",
    "text-stone-600": "text-muted-foreground",
    "text-gray-600": "text-muted-foreground",
    "text-stone-500": "text-muted-foreground",
    "text-gray-500": "text-muted-foreground",
    "text-stone-400": "text-muted-foreground",
    "text-gray-400": "text-muted-foreground",
    "border-stone-100": "border-border",
    "border-gray-100": "border-border",
    "border-gray-200/80": "border-border",
    "border-stone-200": "border-border",
    "border-gray-200": "border-border",
    "border-stone-300": "border-border",
    "border-gray-300": "border-border",
    "ring-gray-300": "ring-border",
    "fill-gray-400": "fill-muted-foreground"
};

const sortedKeys = Object.keys(replaceMap).sort((a, b) => b.length - a.length);
// Escape slashes for regex
const escapedKeys = sortedKeys.map(k => k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
const regex = new RegExp(`(?<=[\\\\s"'\\\\\`:(])(${escapedKeys.join('|')})(?=[\\\\s"'\\\\\`:)\\s])`, 'g');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(regex, (match) => replaceMap[match] || match);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
}

const files = [
    "src/app/(public)/page.tsx",
    "src/app/(public)/login/page.tsx",
    "src/app/(public)/signup/page.tsx",
    "src/app/(protected)/dashboard/page.tsx",
    "src/components/AppSidebar.tsx",
    "src/components/Navbar.tsx",
];

files.forEach(f => {
    const fullPath = path.resolve('c:/Users/hp/nexttodomvc', f);
    if (fs.existsSync(fullPath)) {
        processFile(fullPath);
    } else {
        console.log(`Skipped ${f}`);
    }
});
