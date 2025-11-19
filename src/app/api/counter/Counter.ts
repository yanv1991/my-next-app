// Counter Durable Object class
export class Counter {
    private state: DurableObjectState;
    private value: number = 0;
    private initialized: Promise<void>;

    constructor(state: DurableObjectState) {
        this.state = state;
        // Load persisted value from storage
        this.initialized = this.state.storage.get<number>("value").then((val) => {
            if (val !== undefined) {
                this.value = val;
            }
        });
    }

    async fetch(request: Request): Promise<Response> {
        // Wait for initialization to complete
        await this.initialized;
        
        const url = new URL(request.url);
        const action = url.pathname.split("/").pop() || "get";

        switch (action) {
            case "increment":
                this.value++;
                await this.state.storage.put("value", this.value);
                return Response.json({ value: this.value, action: "incremented" });

            case "decrement":
                this.value--;
                await this.state.storage.put("value", this.value);
                return Response.json({ value: this.value, action: "decremented" });

            case "reset":
                this.value = 0;
                await this.state.storage.put("value", this.value);
                return Response.json({ value: this.value, action: "reset" });

            case "get":
            default:
                return Response.json({ value: this.value });
        }
    }
}

