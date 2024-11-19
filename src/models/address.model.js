const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Address";
const COLLECTION_NAME = "Addresses";

const AddressSchema = new Schema(
  {
    _id: { type: String, required: true }, // ID của tỉnh/thành phố
    Type: { type: String, required: true }, // Loại: province
    Code: { type: String, required: true }, // Mã tỉnh
    Name: { type: String, required: true }, // Tên tỉnh (Tiếng Việt)
    NameEn: { type: String, required: true }, // Tên tỉnh (Tiếng Anh)
    FullName: { type: String, required: true }, // Tên đầy đủ (Tiếng Việt)
    FullNameEn: { type: String, required: true }, // Tên đầy đủ (Tiếng Anh)
    CodeName: { type: String, required: true }, // Tên mã code (không dấu)
    AdministrativeUnitId: { type: Number, required: true }, // ID đơn vị hành chính
    AdministrativeRegionId: { type: Number, required: true }, // ID khu vực hành chính

    // Mảng Districts chứa thông tin các Quận/Huyện
    Districts: [
      {
        _id: { type: String, required: true },
        Type: { type: String, required: true }, // Loại district
        Code: { type: String, required: true }, // Mã quận/huyện
        Name: { type: String, required: true }, // Tên quận (Tiếng Việt)
        NameEn: { type: String, required: true }, // Tên quận (Tiếng Anh)
        FullName: { type: String, required: true }, // Tên đầy đủ (Tiếng Việt)
        FullNameEn: { type: String, required: true }, // Tên đầy đủ (Tiếng Anh)
        CodeName: { type: String, required: true }, // Tên mã code (không dấu)
        ProvinceCode: { type: String, required: true }, // Mã tỉnh
        AdministrativeUnitId: { type: Number, required: true }, // ID đơn vị hành chính

        // Mảng Wards chứa thông tin các Phường/Xã
        Wards: [
          {
            _id: { type: String, required: true },
            Type: { type: String, required: true }, // Loại ward
            Code: { type: String, required: true }, // Mã phường
            Name: { type: String, required: true }, // Tên phường (Tiếng Việt)
            NameEn: { type: String, required: true }, // Tên phường (Tiếng Anh)
            FullName: { type: String, required: true }, // Tên đầy đủ (Tiếng Việt)
            FullNameEn: { type: String, required: true }, // Tên đầy đủ (Tiếng Anh)
            CodeName: { type: String, required: true }, // Tên mã code (không dấu)
            DistrictCode: { type: String, required: true }, // Mã quận
            AdministrativeUnitId: { type: Number, required: true }, // ID đơn vị hành chính
          },
        ],
      },
    ],
  },
  {
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, AddressSchema);
