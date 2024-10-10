import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoListSolana } from "../target/types/todo_list_solana";
import { assert } from "chai";

describe("todo-list-app", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.TodoListSolana as Program<TodoListSolana>;
  const author = program.provider as anchor.AnchorProvider;
  it("can create a task", async () => {
    const task = anchor.web3.Keypair.generate();
    const tx = await program.methods
      .addingTask("You are awesome")
      .accounts({
        task: task.publicKey,
        //@ts-ignore
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([task])
      .rpc();
    console.log("Your transaction signature test", tx);

    const taskAccount = await program.account.task.fetch(task.publicKey);
    console.log("Your task", taskAccount);

    assert.equal(
      taskAccount.author.toBase58(),
      author.wallet.publicKey.toBase58()
    );
    assert.equal(taskAccount.text, "You are awesome");
    assert.equal(taskAccount.isDone, false);
    assert.ok(taskAccount.createdAt);
    assert.ok(taskAccount.updatedAt);
  });
});
