import { HassEntity } from "home-assistant-js-websocket";
import { html, nothing, TemplateResult } from "lit";
import { computeStateDisplay, HomeAssistant, isActive, isAvailable } from "../ha";
import "../shared/badge-icon";
import "../shared/card";
import { Appearance } from "../shared/config/appearance-config";
import "../shared/shape-avatar";
import "../shared/shape-icon";
import "../shared/state-info";
import "../shared/state-item";
import { MushroomBaseElement } from "./base-element";
import { computeInfoDisplay } from "./info";

export function computeDarkMode(hass?: HomeAssistant): boolean {
    if (!hass) return false;
    return (hass.themes as any).darkMode as boolean;
}
export class MushroomBaseCard extends MushroomBaseElement {
    protected renderPicture(picture: string): TemplateResult {
        return html`
            <mushroom-shape-avatar
                slot="icon"
                .picture_url=${(this.hass as any).hassUrl(picture)}
            ></mushroom-shape-avatar>
        `;
    }

    protected renderIcon(stateObj: HassEntity, icon: string): TemplateResult {
        const active = isActive(stateObj);
        return html`
            <mushroom-shape-icon
                slot="icon"
                .disabled=${!active}
                .icon=${icon}
            ></mushroom-shape-icon>
        `;
    }

    protected renderBadge(stateObj: HassEntity) {
        const unavailable = !isAvailable(stateObj);
        return unavailable
            ? html`
                  <mushroom-badge-icon
                      class="unavailable"
                      slot="badge"
                      icon="mdi:help"
                  ></mushroom-badge-icon>
              `
            : nothing;
    }

    protected renderStateInfo(
        stateObj: HassEntity,
        appearance: Appearance,
        name: string,
        state?: string
    ): TemplateResult | null {
        const defaultState = computeStateDisplay(
            this.hass.localize,
            stateObj,
            this.hass.locale,
            this.hass.entities,
            this.hass.connection.haVersion
        );
        const displayState = state ?? defaultState;

        const primary = computeInfoDisplay(
            appearance.primary_info,
            name,
            displayState,
            stateObj,
            this.hass
        );

        const secondary = computeInfoDisplay(
            appearance.secondary_info,
            name,
            displayState,
            stateObj,
            this.hass
        );

        return html`
            <mushroom-state-info
                slot="info"
                .primary=${primary}
                .secondary=${secondary}
            ></mushroom-state-info>
        `;
    }
}
