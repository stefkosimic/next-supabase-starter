#!/usr/bin/env node

const { program } = require("commander");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const exec = (command) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    process.exit(1);
  }
};

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

const writeFile = (filePath, content) => {
  ensureDirectoryExistence(filePath);
  fs.writeFileSync(filePath, content, "utf8");
};

const appendFile = (filePath, content) => {
  ensureDirectoryExistence(filePath);
  fs.appendFileSync(filePath, content, "utf8");
};

const scaffold = async () => {
  console.log(
    "\x1b[34m%s\x1b[0m",
    "Welcome to the Next.js with Supabase scaffolder!"
  );

  const projectName = await question("Enter project name: ");
  const useTypeScript =
    (await question("Use TypeScript? (y/n): ")).toLowerCase() === "y";
  const useAppRouter =
    (await question("Use App Router? (y/n): ")).toLowerCase() === "y";
  const useTailwind =
    (await question("Use TailwindCSS? (y/n): ")).toLowerCase() === "y";
  const useShadcn =
    (await question("Use shadcn/ui? (y/n): ")).toLowerCase() === "y";
  const supabaseProjectId = await question("Enter Supabase Project ID: ");
  const supabaseApiKey = await question("Enter Supabase API Key: ");

  console.log("\x1b[34m%s\x1b[0m", `Creating a Next.js app: ${projectName}`);

  const createNextAppCommand = `npx create-next-app@latest ${projectName} ${
    useTypeScript ? "--typescript" : "--no-typescript"
  } --eslint ${
    useAppRouter ? "--app" : "--no-app"
  } --use-npm --import-alias '@/*'`;
  exec(createNextAppCommand);

  console.log("\x1b[32m%s\x1b[0m", "Next.js app created successfully!");

  process.chdir(projectName);

  console.log(
    "\x1b[34m%s\x1b[0m",
    "Installing Supabase client library and CLI..."
  );
  exec("npm install @supabase/supabase-js");
  exec("npm install -D supabase");

  console.log("\x1b[34m%s\x1b[0m", "Initializing Supabase project...");
  exec("npx supabase init");

  console.log("\x1b[34m%s\x1b[0m", "Creating Supabase client file...");
  const supabaseClientContent = `
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
`;
  writeFile(
    `lib/supabase.${useTypeScript ? "ts" : "js"}`,
    supabaseClientContent.trim()
  );

  console.log("\x1b[34m%s\x1b[0m", "Creating .env.local file...");
  const envContent = `
NEXT_PUBLIC_SUPABASE_URL=https://${supabaseProjectId}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseApiKey}
`;
  writeFile(".env.local", envContent.trim());

  if (useTailwind) {
    console.log("\x1b[34m%s\x1b[0m", "Installing TailwindCSS...");
    exec("npm install -D tailwindcss postcss autoprefixer");
    exec("npx tailwindcss init -p");

    console.log("\x1b[34m%s\x1b[0m", "Updating tailwind.config.js...");
    const tailwindConfig = fs.readFileSync("tailwind.config.js", "utf8");
    const updatedTailwindConfig = tailwindConfig.replace(
      "content: []",
      'content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"]'
    );
    writeFile("tailwind.config.js", updatedTailwindConfig);

    console.log("\x1b[34m%s\x1b[0m", "Updating globals.css...");
    const cssContent = `
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
`;
    writeFile("styles/globals.css", cssContent.trim());
  }

  if (useShadcn) {
    console.log("\x1b[34m%s\x1b[0m", "Installing shadcn/ui...");
    exec("npx shadcn@latest init");

    const components = ["button", "card", "tabs"];
    for (const component of components) {
      console.log(`\x1b[34m%s\x1b[0m`, `Adding ${component} component...`);
      exec(`npx shadcn@latest add ${component}`);
    }
  }

  console.log(
    "\x1b[32m%s\x1b[0m",
    "Setup complete! Your Next.js app with Supabase is ready."
  );
  console.log(
    "\x1b[34m%s\x1b[0m",
    "To start your local Supabase development environment, run:"
  );
  console.log("npx supabase start");
  console.log(
    "\x1b[34m%s\x1b[0m",
    "To start your Next.js development server, run:"
  );
  console.log("npm run dev");

  rl.close();
};

program
  .version("0.0.1")
  .description("A scaffolder for Next.js projects with Supabase and shadcn/ui");

program
  .command("init")
  .description("Initialize a new Next.js project with Supabase and shadcn/ui")
  .action(() => {
    scaffold().catch((error) => {
      console.error("An error occurred during scaffolding:", error);
      process.exit(1);
    });
  });

program.parse(process.argv);
