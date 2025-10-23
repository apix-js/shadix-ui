import { useEventListener } from "@/registry/new-york/hooks/useEventListener";

type EventType =
    | "mousedown"
    | "mouseup"
    | "touchstart"
    | "touchend"
    | "focusin"
    | "focusout";

interface UseClickOutsideProps<T extends HTMLElement = HTMLElement> {
    ref: React.RefObject<T | null> | React.RefObject<T | null>[];
    callback: (event: MouseEvent | TouchEvent | FocusEvent) => void;
    eventType?: EventType;
    eventListenerOptions?: AddEventListenerOptions;
}

export const useClickOutside = <T extends HTMLElement = HTMLElement>({
    ref,
    callback,
    eventType = "mousedown",
    eventListenerOptions,
}: UseClickOutsideProps<T>): void => {
    useEventListener(
        eventType,
        (event) => {
            const target = event.target as Node;

            if (!target || !target.isConnected) return;

            if (!ref) return;

            const isOutside = Array.isArray(ref)
                ? ref
                      .filter((r) => Boolean(r.current))
                      .every((r) => r.current && !r.current.contains(target))
                : ref.current && !ref.current.contains(target);

            if (isOutside) {
                callback(event);
            }
        },
        undefined,
        eventListenerOptions,
    );
};
