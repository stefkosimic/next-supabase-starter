# Next.js Supabase shadcn/ui Scaffolder

This package provides a command-line tool to scaffold a Next.js project with Supabase integration and shadcn/ui components. It streamlines the process of setting up a new project with these technologies, allowing you to get started quickly with a powerful tech stack.

## Features

- Scaffolds a Next.js project
- Integrates Supabase for backend services
- Optionally includes shadcn/ui components
- Supports TypeScript
- Offers choice between Pages Router and App Router
- Optional TailwindCSS integration
- Automatic setup of Supabase client
- Environment variable configuration

## Installation

To use this scaffolder, you need to have Node.js and npm installed on your system. Then, you can install the package globally using npm:

```bash
npm install -g next-supabase-starter
```

## Usage

After installation, you can create a new project by running:

```bash
next-supabase init
```

This command will start an interactive process to set up your new project.

## Configuration Options

During the scaffolding process, you'll be prompted to make several choices:

1. **Project Name**: Enter the name for your new project.
2. **TypeScript**: Choose whether to use TypeScript (y/n).
3. **App Router**: Decide if you want to use Next.js App Router (y/n).
4. **TailwindCSS**: Option to include TailwindCSS in your project (y/n).
5. **shadcn/ui**: Choose whether to include shadcn/ui components (y/n).
6. **Supabase Project ID**: Enter your Supabase project ID.
7. **Supabase API Key**: Provide your Supabase API key.

## Project Structure

After scaffolding, your project will have the following structure:

```
your-project-name/
├── .env.local
├── lib/
│   └── supabase.[js|ts]
├── pages/ (or app/ if using App Router)
├── styles/
│   └── globals.css (if using TailwindCSS)
├── components/ (if using shadcn/ui)
├── tailwind.config.js (if using TailwindCSS)
├── package.json
└── README.md
```

## Post-Installation Steps

After the scaffolding process is complete:

1. Navigate to your project directory:

   ```bash
   cd your-project-name
   ```

2. Start your local Supabase development environment:

   ```bash
   npx supabase start
   ```

3. Start your Next.js development server:
   ```bash
   npm run dev
   ```

## Additional Information

- The scaffolder sets up a basic Supabase client in `lib/supabase.[js|ts]`.
- If you chose to use shadcn/ui, the scaffolder installs the button, card, and tabs components by default.
- The `.env.local` file is created with your Supabase URL and API key. Make sure to keep this file secure and do not commit it to version control.

## Troubleshooting

If you encounter any issues during the scaffolding process, please check the following:

1. Ensure you have the latest version of Node.js and npm installed.
2. Verify that you have the necessary permissions to install global npm packages.
3. Check that your Supabase project ID and API key are correct.

If problems persist, please open an issue on the GitHub repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
