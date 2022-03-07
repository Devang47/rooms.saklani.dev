# Sveltekit + Tailwind Init Project

## Technologies

Sveltekit + Tailwindcss + Typescript

## Getting Started

> \*Feel free to substitute `npm` with `pnpm` or `yarn`.

|                              |                                                              |
| ---------------------------- | ------------------------------------------------------------ |
| Install                      | · `npm install`                                              |
| Develop                      | · `npm run dev`                                              |
| Develop and Open browser tab | · `npm run dev -- --open`                                    |
| Build                        | · `npm run build` => Builds site ready for vercel deployment |
| Preview                      | · `npm run preview` => Previews built site                   |
| Check                        | · `npm run check` => Does a type check across the project    |

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Svelte for VSCode](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

## Recommended File Structure

There are several directories one needs to keep in mind when working with the app during development. All the directories listed below are in the `src` directory and have aliases linked to them allowing for imports done in this manner; `$stores/{FileName}`. Specifically;

### `static`

This directory contains the static files that can be accessed in the app from the `/` route. In this case, its recommended to have the files in directories associated with their types such as `images/png` for png images.

The project types should be placed in the `@types` directory exporting `.ts` files with interfaces and types exported making them accessible to the entire project.

Other directories such as the `utils` are present utility functions used across the application. There are already aliases for these directories thereby allowing their imports to take the following approach `$routes/{...file_path}/{file_name}`. More aliases can be added to the `tsconfig` and `svelte.config` files.

### `src`

- `lib`
  When working in the lib directory, it is important to ensure that only `.svelte` files are in this directory. In particular, these need to be structured using the parent page as the name of the directory. We should have several directories depending on which types of svelte files are included in them. For instance;

  - `pages` - These are entire pages rendered across the site and would ideally eventually become routes (or imported into routes). In this case, these are likely aggregations or combinations of files already in the icons, components, or sections directories.
  - `components` - These are repeated components such as buttons, dropdowns, and others that can be reused in other files across the application.
  - `icons` - These are ideally svgs pasted into svelte files to make sure that they do not require additional fetch requests on the user's end as they are bundled in the resulting html code.
  - `sections` - These are entire sections (often aggregations of components) such as showcase sections, carousels, contact forms, and such that can be used separately but can also be included in the page where they'll be rendered.

  Please note that the naming convention for the files in the lib directory is; `{parentDirectory}/index.svelte` for the main component being exported but for the rest also at the same level or related to the page, icon, etc, these can have their own names.

- `routes`
  This directory contains the route files associated with the app.
- `stores`
  This directory includes the stores used across the app. These should be named based on the page or function of the store. i.e. `auth.store.ts` or `history.store.ts`. The `store` suffix is mandatory and recommended.
- `style`
  All css files used across the application must be in this directory. Since tailwindcss is being used, additional files are not required. However, if need for an additional file arises, it should be placed in this directory.
- `utils`
  This directory contains all the utility functions used across the application. The naming convention here is similar to the stores, but with a `util.ts` suffix. Additionally, it is recommended that these be classified based on function. An example of this is all `auth` related utility functions be in a child `auth` directory within the `utils` folder.
- `icons`
  This directory contains all svg icons used across the app, but initialized within `.svelte` components. All these are reusable across the application. The `.svelte` should contain the actual svg content and might expose props to modify the underlying svg such as its fill color, among other attributes of the icon.

## Styling

When working with styles, one has the choice of either adding the styles in the html or styles section. However, its recommended to use the styles section and limiting the length of the styles to improve readability.
In some cases, such as when using darkmode in sveltekit and tailwind css, one is required to make the styles global. In these instances, and others, it is recommended to wrap the selector with the `:local()`. As shown in the example below, the classes are organized in a readable manner and can be easily maintained in the future.

```postcss
.HeaderButton {
  @apply bg-red-300;
  @apply mx-auto pt-2;
  @apply text-sm text-gray-400;
}
```

## Automatic Formating on Github

The repository currently uses Husky pre-commit hooks to format the code based on the `.prettierrc` file. This automatically kicks in before the files are added to the commit. If successful, a message similar to the one shown in the screenshot below will be shown.
![image](https://user-images.githubusercontent.com/89821717/145913449-fcd7e5c8-ebf8-416c-bf5f-7ab5c32f9be7.png)

## Suggested Component Development Approach

Owing to the fact that there is no theme initialized in the tailwind files, these will have to be added as development proceeds. In this case, one would confirm that the color of the component they want to add does not yet exist and if it doesn't, it should be added to either the `dark` or `light` theme sections in the `tailwind.config.cjs` file in the sections indicated below.

```js
	theme: {
		extend: {
			colors: {
				...require('tailwindcss/defaultTheme').colors,
				// Add other colors (theme here)
				dark: {
					// Light Theme Colors
				},
				light: {
					// Dark Theme Colors
				},
			},
		},
	},
```

### tailwind.config.cjs

To foster DRY principles, it is recommended to extend the basic tailwind theme in this file to ensure that theme related changes can be made from a single point as opposed to searching for what changes to make within the code. Having all the colors in this file ensures that any changes to the design theme can be made from a single file.

## types

Being a typescript project, it is recommended that the types used across the application be defined before hand. However, this should not be done within the `.svelte` files or `.ts` files. The approach here is to create a `@types` or `@interfaces` directory depending on the project and declaring types within `.d.ts` files in these directories.
