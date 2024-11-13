import { Component, OnInit } from "@angular/core";
import { ListingComponent } from "../../../components/listing/listing.component";
import { ListingService } from "../../../services/listing.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ViewVehicleClassComponent } from "../view-vehicle-class/view-vehicle-class.component";
import { AddVehicleClassComponent } from "../add-vehicle-class/add-vehicle-class.component";
import { DialogService } from "../../../services/dialog.service";
import { VehicleService } from "../../../services/vehicle.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";


@Component({
  selector: "app-vehicle-class",
  standalone: true,
  templateUrl: "./vehicle-class.component.html",
  styleUrl: "./vehicle-class.component.scss",
  imports: [ListingComponent, ViewVehicleClassComponent, AddVehicleClassComponent, ReactiveFormsModule, CommonModule, NgMultiSelectDropDownModule],
})
export class VehicleClassComponent implements OnInit {
  vehicleClassForm!: FormGroup;
  private editedDataSubscription: Subscription;

  constructor(private listingService: ListingService, private fb: FormBuilder, public dialogService: DialogService, private vehicleService: VehicleService,
    public router: Router,
  ) {
    this.vehicleTypes = ['Car', 'Motorcycle', 'Limo'];
    this.vehicleClassForm = this.fb.group({
      vehicleType: ['', Validators.required],
      class: ['', Validators.required],
      passenger: ['', Validators.required],
      active: ['', Validators.required],
      features: ['', Validators.required]
    });

    this.editedDataSubscription = this.vehicleService.editedData$.subscribe((data) => {
      this.updateVehicleClassData(data);
    });
  }

  vehicleClassData: any = [];
  headers: {}[] = [];
  columnWidths: string[] = [];
  isAddModal: boolean = false;
  isEditModal: boolean = false;
  vehicleTypes: string[] = [];
  selectedFormFeture: string[] = [];
  isViewModal: boolean = false;
  selectedRowData: any = null;
  isOneEditIconOnly: boolean = true;
  currentEditableIndex: number = -1;

  features = [
    { item_id: 1, item_text: '5 Seates' },
    { item_id: 2, item_text: 'AC' },
    { item_id: 3, item_text: '3 Luggage' },
    { item_id: 4, item_text: 'Automatic' },
    { item_id: 5, item_text: 'Mild Hybrid' },
    { item_id: 6, item_text: 'Plugin Hybrid' },
    { item_id: 7, item_text: 'EV' },
  ];

  settings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    allowSearchFilter: true,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 3,
    searchPlaceholderText: 'Search',
    noDataAvailablePlaceholderText: 'No data available',
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: true,
    defaultOpen: false,
  };

  ngOnInit(): void {
    this.vehicleService.getVehicleClass().subscribe((res: any) => {
      if (res) {
        this.vehicleClassData = res;
      }
    })

    this.headers = [
      { header: "Class", field: 'class', type: "label", width: "25%" },
      { header: "Vehicle Type", field: 'vehicleType', type: "label", width: "10%" },
      { header: "Passenger", field: 'passenger', type: "label", width: "10%" },
      { header: "Features", field: 'features', type: "label", width: "32%" },
      { header: "# of vehicles", field: 'noOfVehicles', type: "label", width: "10%" },
      { header: "Active", field: 'active', type: "label", width: "8%" },
    ];

    this.listingService.updateTableData(this.vehicleClassData);

    this.listingService.deleteInitiated.subscribe(payload => {
      const componentName = payload.componentName;
      const index = payload.index;

      this.vehicleClassData.splice(index, 1);
      this.listingService.updateTableData(this.vehicleClassData);


    });
  }
  addvehicleClass() {
    this.router.navigate(['vehicle/add-vehicle-class']);
  }

  onSubmit(data: any) {
    this.vehicleClassData.push(data);
    this.dialogService.showAddVehicleClassModal = true;
  }

  viewClass() {
    this.isViewModal = true;
  }

  onRowClicked(rowData: any) {
    this.router.navigate([`vehicle/view-vehicle-class/${rowData.id}`]);
  }

  onEditClicked(data: any) {
    data.event.stopPropagation();
    this.router.navigate([`vehicle/edit-vehicle-class/${data.row.id}`]);
  }

  private updateVehicleClassData(updatedItem: any): void {
    if (this.currentEditableIndex !== -1) {
      this.vehicleClassData[this.currentEditableIndex] = updatedItem;
      this.vehicleClassData[this.currentEditableIndex].noOfVehicles = this.vehicleClassData[this.currentEditableIndex].noOfVehicles;
      this.vehicleClassData[this.currentEditableIndex].features = updatedItem.features[0] !== undefined ? updatedItem.features : this.selectedRowData.features;
    } else {
      this.vehicleClassData.push(updatedItem);
    }
  }

  ngOnDestroy(): void {
    this.editedDataSubscription.unsubscribe();
  }
}
