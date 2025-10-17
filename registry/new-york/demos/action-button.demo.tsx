"use client";
import type React from "react";

import ActionButton from "@/registry/new-york/components/action-button";

const ActionButtonDemo: React.FC<ActionButtonDemoProps> = () => {
    const onConfirm = async () => {
        try {
            return await new Promise<{ message?: string; error?: boolean }>(
                (resolve, reject) => {
                    const actions = ["reject", "resolve"];
                    const action =
                        actions[Math.floor(Math.random() * actions.length)];

                    setTimeout(
                        () =>
                            action === "resolve"
                                ? resolve({
                                      message: "Action successful",
                                      error: false,
                                  })
                                : reject({
                                      message: "Something went wrong",
                                      error: true,
                                  }),
                        1000,
                    );
                },
            );
        } catch (error: unknown) {
            return {
                message: (error as Error).message ?? "Something went wrong",
                error: true,
            };
        }
    };

    return (
        <ActionButton
            variant="outline"
            popupContent={
                <div>
                    This action cannot be undone. This will permanently delete
                    your data from our database.
                </div>
            }
            title="Are you sure want to continue?"
            onConfirm={onConfirm}
        >
            Click Me
        </ActionButton>
    );
};

type ActionButtonDemoProps = Record<string, never>;

export default ActionButtonDemo;
