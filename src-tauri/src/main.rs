// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // setting up the environment for the application
    klark_lib::setup_environment();
    klark_lib::run()
}
