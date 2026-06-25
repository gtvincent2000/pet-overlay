use tauri::{
    menu::MenuBuilder,
    tray::TrayIconBuilder,
    Manager,
    WebviewUrl,
    WebviewWindowBuilder,
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let menu = MenuBuilder::new(app)
                .text("open_menu", "Open Menu")
                .text("open_overlay", "Open Overlay")
                .text("close_overlay", "Close Overlay")
                .separator()
                .text("quit", "Quit App")
                .build()?;

            TrayIconBuilder::new()
                .tooltip("Overlay Companion")
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(|app_handle, event| {
                    match event.id().as_ref() {
                        "open_menu" => {
                            if let Some(window) = app_handle.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "open_overlay" => {
                            if let Some(window) = app_handle.get_webview_window("overlay") {
                                let _ = window.show();
                                let _ = window.set_focus();
                                return;
                            }

                            let app_handle = app_handle.clone();

                            std::thread::spawn(move || {
                                let result = WebviewWindowBuilder::new(
                                    &app_handle,
                                    "overlay",
                                    WebviewUrl::App("index.html#/overlay".into()),
                                )
                                .title("Overlay")
                                .inner_size(420.0, 220.0)
                                .decorations(false)
                                .transparent(true)
                                .shadow(false)
                                .resizable(false)
                                .always_on_top(true)
                                .skip_taskbar(true)
                                .build();

                                if let Err(error) = result {
                                    eprintln!("Failed to create overlay window: {error}");
                                }
                            });
                        }
                        "close_overlay" => {
                            if let Some(window) = app_handle.get_webview_window("overlay") {
                                let _ = window.close();
                            }
                        }
                        "quit" => {
                            app_handle.exit(0);
                        }
                        _ => {}
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}