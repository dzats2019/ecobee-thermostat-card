# Ecobee Thermostat Card (unofficial)

A standalone Home Assistant Lovelace thermostat dashboard card inspired by the visual layout in a Lennox touchscreen reference image, with **ecobee** text branding. This project is not affiliated with, sponsored by, or endorsed by Ecobee.

## Features

- Dark blue thermostat interface with circular dial, date/time, humidity, HVAC mode/action, target temperature, outdoor temperature and configurable occupancy status.
- Expandable plus/minus temperature controls and supported HVAC mode buttons.
- Supports single-setpoint thermostats and `heat_cool` thermostats exposing `target_temp_low` and `target_temp_high`.
- Works with any Home Assistant `climate.*` entity that supports standard climate services; Ecobee-specific behavior is determined by the integration.
- No dependencies, build steps, external connections, third-party tracking or automatic HVAC control.

## Installation through HACS (recommended)

1. Create a **public** GitHub repository named `ecobee-thermostat-card` and upload **the contents** of this project (including `hacs.json`) to the root of the repository. Do not upload only the ZIP.
2. In Home Assistant open **HACS → ⋮ → Custom repositories**.
3. Enter your GitHub repository URL (`https://github.com/YOUR_USERNAME/ecobee-thermostat-card`), choose **Dashboard**, and select **Add**.
4. Find **Ecobee Thermostat Card** in HACS, open it, and select **Download**.
5. In **Settings → Dashboards → ⋮ → Resources**, verify a JavaScript module resource was added for `/hacsfiles/ecobee-thermostat-card/ecobee-thermostat-card.js`. Add it manually if missing.
6. Hard-refresh the browser, then add a **Manual** card using one of the examples below.

The GitHub repository name must match `ecobee-thermostat-card` for HACS's standard dashboard file discovery. HACS can install from the default branch even before the first GitHub release; a tagged GitHub release is recommended for versioned updates.

Do not register both `/local/ecobee-thermostat-card.js` and `/hacsfiles/ecobee-thermostat-card/ecobee-thermostat-card.js` at the same time. Remove an old manual resource if migrating to HACS.

## Manual installation (optional)

Copy `ecobee-thermostat-card.js` to `/config/www/ecobee-thermostat-card.js`, then register `/local/ecobee-thermostat-card.js?v=1.0.0` as a **JavaScript module** under **Settings → Dashboards → ⋮ → Resources**. Hard-refresh before adding the custom card.

## Example: Living room

```yaml
type: custom:ecobee-thermostat-card
entity: climate.living_room
name: LIVING ROOM
outside_entity: sensor.kpne_temperature
presence_entity: person.dmitriy
# humidity_entity: sensor.living_room_humidity
```

## Example: Garage

```yaml
type: custom:ecobee-thermostat-card
entity: climate.garage
name: GARAGE
outside_entity: sensor.kpne_temperature
```

**Note:** Above climate and weather entities are illustrative. Confirm exact IDs in Home Assistant under Developer Tools → States. Without `outside_entity`, the outdoor value displays `—`. Without `presence_entity`, the left status displays `status`. Indoor humidity defaults to the climate entity's `current_humidity` attribute; `humidity_entity` overrides it.

## Options

| Option | Required | Purpose |
|---|---|---|
| `entity` | Yes | Home Assistant climate entity |
| `name` | No | Display heading, defaults to ECOBEE |
| `outside_entity` | No | Temperature sensor whose units match HA temperature units |
| `humidity_entity` | No | Humidity sensor override |
| `presence_entity` | No | `person.*`, `device_tracker.*`, or binary sensor; shows home/away |
| `min_temp`, `max_temp` | No | Override climate entity minimum and maximum permitted target |
| `step` | No | Override the thermostat's setpoint increment |

## Behavior and safeguards

- **Nothing is changed automatically**. The card sends service calls only after you press a control.
- Mode options are taken from `hvac_modes`. Unsupported modes are not displayed.
- While a command is pending, buttons are disabled. Errors are shown below the controls.
- Missing/unavailable climate entity state disables control buttons.
- Temperature boundaries use the entity-provided minimum, maximum and target step where available.
- In auto mode, separate heat and cool target values are adjusted while maintaining at least one step of separation.
- The circular dial currently provides a fixed decorative arc, not an interactive temperature scale. Use the explicit plus/minus buttons to change setpoints.
- The date/time use the device's browser clock. Outdoor data are read directly from the configured entity and are **not automatically converted** between Fahrenheit/Celsius.
- Occupancy status is informational; tapping it opens controls, not an automation.
- Ecobee comfort profiles, holds, and schedules are not changed or managed by this card. Some integrations may interpret `climate.set_temperature` as a temporary hold; confirm actual device behavior before routine use.
- Heating/cooling action display depends on the entity's `hvac_action` attribute. Without it, the configured HVAC mode is shown.

## Repository contents

- `ecobee-thermostat-card.js` – card implementation
- `README.md` – configuration and install guidance
- `living-room.yaml` and `garage.yaml` – ready-to-edit examples

## Rollback

Remove the card from the dashboard and delete the resource registration. The script itself does not change HA automations or configuration.

## License

MIT. See LICENSE.
