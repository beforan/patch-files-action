import * as patcher from "./patcher";
import * as fjp from "fast-json-patch";
import * as core from "@actions/core";
import xmlpoke from "xmlpoke";

export class XmlPatcher implements patcher.IPatcher {
  apply(content: string, patchContent: fjp.Operation[]): string {
    try {
      return xmlpoke(content, (poker: any) =>
        patchContent.reduce((xml, patch) => {
          switch (patch.op) {
            case "add":
              return xml.add(patch.path, patch.value);
            case "remove":
              return xml.remove(patch.path);
            case "replace":
              return xml.set(patch.path, patch.value);
          }
        }, poker)
      );
    } catch (e) {
      throw new Error(`Failed to apply patch: ${e}`);
    }
  }
}
