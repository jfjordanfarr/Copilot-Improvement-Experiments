import type { ExplorerServerInstance, ExplorerServerOptions } from "@live-documentation/scripts";
import { startExplorerServer } from "@live-documentation/scripts";

const DEFAULT_PORT = 3000;

async function main(): Promise<void> {
    const workspaceRoot = process.cwd();
    const options: ExplorerServerOptions = {
        workspaceRoot,
        port: DEFAULT_PORT
    };
    const server = await startExplorerServer(options);
    registerSignalHandlers(server);
}

function registerSignalHandlers(server: ExplorerServerInstance): void {
    const shutdown = async () => {
        try {
            await server.stop();
        } catch (error) {
            console.error("Explorer shutdown failed", error);
        } finally {
            process.exit(0);
        }
    };

    ["SIGINT", "SIGTERM"].forEach(signal => {
        process.on(signal, () => {
            void shutdown();
        });
    });
}

main().catch(error => {
    console.error("Explorer failed to start", error);
    process.exitCode = 1;
});
