use tauri::menu::{MenuBuilder, MenuItemBuilder};
use tauri::tray::{MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{Manager, WindowEvent};

#[tauri::command]
async fn resize_window(width: f64, height: f64, window: tauri::Window) -> Result<(), String> {
    let _ = window.set_size(tauri::Size::Logical(tauri::LogicalSize {
        width: width,
        height: height,
    }));
    Ok(())
}

#[tauri::command]
async fn get_ollama_config() -> (String, String) {
    let url = std::env::var("OLLAMA_URL").unwrap_or_else(|_| "http://localhost".to_string());
    let model = std::env::var("OLLAMA_MODEL").unwrap_or_else(|_| "gemma3:4b".to_string());
    (url, model)
}

#[tauri::command]
async fn set_environment_variable(key: String, value: String) {
    std::env::set_var(key, value);
}

pub fn setup_environment() {
    std::env::set_var("OLLAMA_URL", "http://localhost");
    std::env::set_var("OLLAMA_MODEL", "klark:latest");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .setup(|app| {
            // Set initally hidden
            let main_window = app.get_webview_window("main").unwrap();
            main_window.hide().unwrap();

            let settings = MenuItemBuilder::new("Settings")
                .id("settings")
                .build(app)
                .unwrap();
            let quit = MenuItemBuilder::new("Quit").id("quit").build(app).unwrap();

            let tray_menu = MenuBuilder::new(app)
                .items(&[&settings, &quit])
                .build()
                .unwrap();

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .show_menu_on_left_click(false)
                .menu(&tray_menu)
                .on_tray_icon_event(|tray_icon, event| match event {
                    TrayIconEvent::Click {
                        button_state, rect, ..
                    } if button_state == MouseButtonState::Up => {
                        let window = tray_icon.app_handle().get_webview_window("main").unwrap();

                        let Ok(window_size) = window.inner_size() else {
                            return;
                        };

                        let tauri::LogicalPosition { x, y } = rect.position.to_logical::<f64>(1.0);
                        let tauri::LogicalSize { width, height } = rect.size.to_logical::<f64>(1.0);

                        let tray_x_center = x + (width / 2.0);
                        let new_x = tray_x_center - (window_size.width as f64 / 2.0);
                        let new_y = y + height + 6.0;

                        let _ = window
                            .set_position(tauri::PhysicalPosition::new(new_x as i32, new_y as i32));

                        if window.is_visible().unwrap() {
                            let _ = window.hide();
                        } else {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    _ => {}
                })
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "quit" => {
                        let _ = app.exit(0);
                    }
                    "settings" => {
                        if let Some(settings_window) = app.get_webview_window("settings") {
                            let _ = settings_window.show();
                            let _ = settings_window.set_focus();
                        } else {
                            let _ = tauri::WebviewWindowBuilder::new(
                                app,
                                "settings",
                                tauri::WebviewUrl::App("settings.html".into()),
                            )
                            .title("Settings")
                            .center()
                            .inner_size(400.0, 330.0)
                            .decorations(true)
                            .build()
                            .unwrap();
                        }
                    }
                    _ => {}
                })
                .build(app)?;

            #[cfg(target_os = "macos")]
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            Ok(())
        })
        .on_window_event(|window, event| match event {
            WindowEvent::Focused(true) => {
                println!("App focused. Resetting state...");
                // let _ = window.emit("app-reset", {});
            }
            WindowEvent::Focused(false) => {
                println!("App Focus Removed");
                if window.label() == "main" {
                    let _ = window.hide();
                }
            }
            _ => {}
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            resize_window,
            get_ollama_config,
            set_environment_variable
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
